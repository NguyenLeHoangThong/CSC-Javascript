import { test, expect } from "../fixtures/test-fixtures";

// Bài 34/35 — widget AI.
//
// Phần lớn spec này MOCK route `/ai/suggest`: gọi Gemini thật thì chậm, tốn tiền, tốn
// quota, và trả về chữ khác nhau mỗi lần nên không assert nổi. Cái cần kiểm tra ở đây
// là HÀNH VI CỦA UI trước từng loại phản hồi, không phải chất lượng câu trả lời của LLM.
//
// Test cuối cùng thì cố tình KHÔNG mock, để xác nhận đường dây thật (FE -> BE -> lỗi
// 503 vì server chưa cấu hình key) hiển thị tử tế.

const SUGGEST_URL = "**/api/v1/ai/suggest*";

test.describe("Widget gợi ý AI", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("hiện trên trang chủ, phía trên danh sách sản phẩm", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Trợ lý mua sắm AI" })).toBeVisible();
  });

  test("nút bị khoá cho tới khi nhập đủ 3 ký tự", async ({ page }) => {
    const button = page.getByRole("button", { name: /Gợi ý/ });
    await expect(button).toBeDisabled();

    await page.getByLabel("Bạn đang cần gì?").fill("la");
    await expect(button).toBeDisabled();

    await page.getByLabel("Bạn đang cần gì?").fill("laptop");
    await expect(button).toBeEnabled();
  });

  test("trạng thái loading rồi tới success", async ({ page }) => {
    await page.route(SUGGEST_URL, async (route) => {
      // Trễ có chủ ý để kịp nhìn thấy trạng thái loading.
      await new Promise((r) => setTimeout(r, 400));
      await route.fulfill({
        json: {
          success: true,
          data: { query: "laptop", suggestion: 'MacBook Pro 14" — mạnh cho lập trình.', cached: false },
        },
      });
    });

    await page.getByLabel("Bạn đang cần gì?").fill("laptop lập trình");
    await page.getByRole("button", { name: /Gợi ý/ }).click();

    await expect(page.getByRole("button", { name: /Đang nghĩ/ })).toBeVisible();
    await expect(page.getByText('MacBook Pro 14" — mạnh cho lập trình.')).toBeVisible();
    await expect(page.getByText("Gợi ý bởi AI")).toBeVisible();
  });

  test("câu trả lời từ cache được ghi nhãn khác", async ({ page }) => {
    await page.route(SUGGEST_URL, (route) =>
      route.fulfill({
        json: { success: true, data: { query: "laptop", suggestion: "Dell XPS 15", cached: true } },
      })
    );

    await page.getByLabel("Bạn đang cần gì?").fill("laptop mỏng nhẹ");
    await page.getByRole("button", { name: /Gợi ý/ }).click();

    await expect(page.getByText("Trả từ cache")).toBeVisible();
  });

  test("429 rate limit hiện message của backend", async ({ page }) => {
    await page.route(SUGGEST_URL, (route) =>
      route.fulfill({
        status: 429,
        json: { success: false, message: "AI is busy right now. Please retry in a few seconds." },
      })
    );

    await page.getByLabel("Bạn đang cần gì?").fill("tai nghe chống ồn");
    await page.getByRole("button", { name: /Gợi ý/ }).click();

    await expect(page.getByText("AI is busy right now")).toBeVisible();
    // Lỗi không được để lại gợi ý cũ trên màn hình.
    await expect(page.getByText("Gợi ý bởi AI")).toHaveCount(0);
  });

  test("hết quota ngày (503) cũng hiển thị tử tế", async ({ page }) => {
    await page.route(SUGGEST_URL, (route) =>
      route.fulfill({
        status: 503,
        json: { success: false, message: "AI daily quota exceeded. Please try again tomorrow." },
      })
    );

    await page.getByLabel("Bạn đang cần gì?").fill("điện thoại chụp ảnh đẹp");
    await page.getByRole("button", { name: /Gợi ý/ }).click();

    await expect(page.getByText("AI daily quota exceeded")).toBeVisible();
  });

  test("lỗi mạng rơi về message chung, không hiện màn hình trắng", async ({ page }) => {
    await page.route(SUGGEST_URL, (route) => route.abort("failed"));

    await page.getByLabel("Bạn đang cần gì?").fill("máy tính bảng");
    await page.getByRole("button", { name: /Gợi ý/ }).click();

    await expect(page.getByText(/Không gọi được trợ lý AI/)).toBeVisible();
  });

  test("bấm chip ví dụ thì điền input và hỏi luôn", async ({ page }) => {
    await page.route(SUGGEST_URL, (route) =>
      route.fulfill({
        json: { success: true, data: { query: "x", suggestion: "Gợi ý mẫu", cached: false } },
      })
    );

    await page.getByRole("button", { name: "laptop cho lập trình viên" }).click();

    await expect(page.getByLabel("Bạn đang cần gì?")).toHaveValue("laptop cho lập trình viên");
    await expect(page.getByText("Gợi ý mẫu")).toBeVisible();
  });

  test("KHÔNG mock: gọi backend thật, server chưa có GEMINI_API_KEY -> 503 có message", async ({ page }) => {
    // Đường dây thật FE -> BE. Không cần key Gemini: cái đang test là backend biết tự
    // trả lời tử tế khi chưa cấu hình, và FE hiển thị đúng thay vì treo mãi ở "Đang nghĩ".
    const response = page.waitForResponse((res) => res.url().includes("/ai/suggest"));

    await page.getByLabel("Bạn đang cần gì?").fill("laptop chơi game");
    await page.getByRole("button", { name: /Gợi ý/ }).click();

    expect((await response).status()).toBe(503);
    await expect(page.getByText(/AI feature is not configured/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Đang nghĩ/ })).toHaveCount(0);
  });

  test("response của AI không được cache bởi trình duyệt", async ({ page }) => {
    // Bài 37 — gợi ý mang tính cá nhân, phải là no-store.
    const response = page.waitForResponse((res) => res.url().includes("/ai/suggest"));

    await page.getByLabel("Bạn đang cần gì?").fill("sạc nhanh usb-c");
    await page.getByRole("button", { name: /Gợi ý/ }).click();

    expect((await response).headers()["cache-control"]).toContain("no-store");
  });
});

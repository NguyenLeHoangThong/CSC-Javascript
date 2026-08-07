import { test, expect } from "../fixtures/test-fixtures";

// Smoke test: FE nói chuyện được với BE thật và Postgres thật.
// Nếu file này đỏ thì mọi spec khác đỏ theo — đọc nó trước tiên khi debug.

test.describe("Trang chủ", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("tải được sản phẩm từ API thật", async ({ page }) => {
    // "iPhone 15 Pro" là dữ liệu seed — nó tới từ Postgres, không phải mock.
    await expect(page.getByText("iPhone 15 Pro").first()).toBeVisible();
    await expect(page.getByText('MacBook Pro 14"').first()).toBeVisible();
  });

  test("hiển thị giá đã format, không phải chuỗi Decimal thô", async ({ homePage }) => {
    // Prisma trả Decimal dạng "999.00"; productService phải serialize về number thì
    // toLocaleString() mới ra "999". Bug này chỉ lộ khi chạy thật.
    const card = homePage.productCard("iPhone 15 Pro");
    await expect(card.getByText("999₫")).toBeVisible();
  });

  test("tìm kiếm lọc ở server và có debounce", async ({ page, homePage }) => {
    // Chờ đúng request mà debounce (400ms) sinh ra — không dùng waitForTimeout.
    const searchRequest = page.waitForRequest(
      (req) => req.url().includes("/products") && req.url().includes("search=macbook")
    );

    await homePage.search("macbook");
    await searchRequest;

    await expect(page.getByText('MacBook Pro 14"').first()).toBeVisible();
    await expect(page.getByText("iPhone 15 Pro")).toHaveCount(0);
  });

  test("gõ nhanh chỉ bắn 1 request nhờ debounce", async ({ page, homePage }) => {
    const requests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/products?") && req.url().includes("search=")) requests.push(req.url());
    });

    // 6 lần setState liên tiếp, mỗi lần cách nhau ngắn hơn 400ms.
    await homePage.searchInput.pressSequentially("macbook", { delay: 50 });

    await expect
      .poll(() => requests.length, { message: "phải chỉ có 1 request search" })
      .toBe(1);
  });

  test("lọc theo danh mục", async ({ page, homePage }) => {
    await homePage.selectCategory("Laptops");

    await expect(page.getByText('MacBook Pro 14"').first()).toBeVisible();
    await expect(page.getByText("iPhone 15 Pro")).toHaveCount(0);
  });

  test("báo rỗng khi không có sản phẩm khớp", async ({ page, homePage }) => {
    await homePage.search("khong-ton-tai-san-pham-nay-xyz");

    await expect(page.getByText("Không có sản phẩm phù hợp.")).toBeVisible();
  });

  test("khách chưa đăng nhập thấy nút Đăng nhập", async ({ homePage }) => {
    await expect(homePage.loginButton).toBeVisible();
  });
});

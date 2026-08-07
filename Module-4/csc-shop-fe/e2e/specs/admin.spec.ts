import { test, expect, API_URL, SEED_ADMIN } from "../fixtures/test-fixtures";
import { AdminProductsPage } from "../pages/AdminProductsPage";

// Dashboard admin. Mỗi test tự tạo dữ liệu riêng (tên có timestamp) và tự dọn, để chạy
// song song mà không giẫm chân nhau.

test.describe("Admin — sản phẩm", () => {
  test("tạo, sửa rồi xoá một sản phẩm", async ({ adminPage }) => {
    const productsPage = new AdminProductsPage(adminPage);
    const title = `E2E Product ${Date.now()}`;

    await productsPage.goto();

    // ── Tạo ──
    await productsPage.openCreateDialog();
    await productsPage.fillProduct({
      title,
      price: 123,
      category: "Laptops",
      stock: 7,
      thumbnail: "https://picsum.photos/seed/e2e/400",
      description: "Sản phẩm do E2E tạo ra.",
    });
    await productsPage.save();

    // Bài 31 — Module 3 gửi `category` (slug) trong khi backend cần `categoryId` (số),
    // nên bước này luôn 400 và dialog vẫn đóng im lặng như thể đã lưu.
    await expect(productsPage.dialog).toBeHidden();
    await expect(productsPage.row(title)).toBeVisible();
    await expect(productsPage.row(title)).toContainText("laptops");
    await expect(productsPage.row(title)).toContainText("7");

    // ── Sửa ──
    await productsPage.row(title).getByRole("button").first().click();
    await expect(productsPage.dialog).toBeVisible();
    await productsPage.stockInput.fill("42");
    await productsPage.save();

    await expect(productsPage.dialog).toBeHidden();
    await expect(productsPage.row(title)).toContainText("42");

    // ── Xoá ──
    await productsPage.deleteProduct(title);
    await expect(productsPage.row(title)).toHaveCount(0);
  });

  test("lỗi lưu được hiển thị chứ không nuốt im lặng", async ({ adminPage }) => {
    const productsPage = new AdminProductsPage(adminPage);
    await productsPage.goto();

    await productsPage.openCreateDialog();
    // Thiếu categoryId + description -> backend trả 400.
    await productsPage.titleInput.fill(`Thiếu Trường ${Date.now()}`);
    await productsPage.priceInput.fill("10");
    await productsPage.save();

    await expect(productsPage.saveError).toBeVisible();
    // Dialog PHẢI ở lại để người dùng sửa, không được đóng như thể đã thành công.
    await expect(productsPage.dialog).toBeVisible();
  });

  test("danh sách hiện dữ liệu seed kèm tồn kho", async ({ adminPage }) => {
    const productsPage = new AdminProductsPage(adminPage);
    await productsPage.goto();

    await expect(productsPage.row("iPhone 15 Pro")).toBeVisible();
    await expect(productsPage.row("iPhone 15 Pro")).toContainText("smartphones");
  });
});

test.describe("Admin — đơn hàng", () => {
  test("hiện tên khách và đổi được trạng thái", async ({ adminPage, request }) => {
    // Tạo đơn RIÊNG cho test này thay vì dựa vào đơn seed: bảng sắp xếp theo createdAt
    // desc và các test khác cũng tạo đơn, nên "dòng đầu tiên" không phải mốc ổn định.
    const customerName = `E2E Order ${Date.now()}`;
    const created = await request.post(`${API_URL}/orders`, {
      data: {
        customerName,
        email: "order-status@test.local",
        phone: "0901234567",
        address: "1 Đường Test, Quận 1",
        items: [{ productId: 1, quantity: 1 }],
      },
    });
    expect(created.status(), await created.text()).toBe(201);

    await adminPage.goto("/admin/orders");
    await expect(adminPage.getByRole("heading", { name: "Quản lý đơn hàng" })).toBeVisible();

    // Bài 31 — cột này trước đây trống vì FE đọc `o.userName` còn backend trả
    // `customerName`.
    const row = adminPage.getByRole("row").filter({ hasText: customerName });
    await expect(row).toBeVisible();
    await expect(row).toContainText("pending");

    // Đổi trạng thái: STATUS_OPTIONS phải khớp enum của backend, nếu không là 400.
    const patched = adminPage.waitForResponse(
      (res) => res.url().includes("/status") && res.request().method() === "PATCH"
    );
    await row.getByRole("combobox").click();
    await adminPage.getByRole("option", { name: "shipped" }).click();
    expect((await patched).status()).toBe(200);

    // Đã lưu xuống server chứ không chỉ đổi trên UI.
    await adminPage.reload();
    await expect(
      adminPage.getByRole("row").filter({ hasText: customerName })
    ).toContainText("shipped");
  });
});

test.describe("Admin — người dùng", () => {
  test("liệt kê user và KHÔNG lộ password/refreshToken", async ({ adminPage, request }) => {
    await adminPage.goto("/admin/users");
    await expect(adminPage.getByRole("heading", { name: "Quản lý người dùng" })).toBeVisible();
    await expect(adminPage.getByText("admin@cscshop.com")).toBeVisible();

    // Bài 36 — kiểm tra thẳng response API: USER_SELECT là allow-list.
    const token = await adminPage.evaluate(() => localStorage.getItem("accessToken"));
    const res = await request.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();

    expect(res.status()).toBe(200);
    for (const user of body.data) {
      expect(user).not.toHaveProperty("password");
      expect(user).not.toHaveProperty("refreshToken");
    }
  });

  test("nút đổi role / xoá bị khoá với chính tài khoản đang đăng nhập", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");

    const ownRow = adminPage.getByRole("row").filter({ hasText: "admin@cscshop.com" });
    await expect(ownRow.getByRole("button").first()).toBeDisabled();
    await expect(ownRow.getByRole("button").nth(1)).toBeDisabled();
  });

  test("backend cũng tự chặn admin tự đổi role mình, không chỉ dựa vào UI", async ({ request }) => {
    // FE disable nút, nhưng ai cũng gọi API trực tiếp được — server phải tự bảo vệ.
    // Test này thuần API nên đăng nhập thẳng qua request, không cần mở trình duyệt.
    const login = await request.post(`${API_URL}/auth/login`, { data: SEED_ADMIN });
    const { accessToken } = (await login.json()).data;

    const me = await request.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const myId = (await me.json()).data.id;

    const res = await request.patch(`${API_URL}/users/${myId}/role`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { role: "customer" },
    });

    expect(res.status()).toBe(400);
    expect((await res.json()).message).toContain("your own role");
  });
});

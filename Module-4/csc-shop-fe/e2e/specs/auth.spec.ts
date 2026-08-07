import { test, expect, SEED_CUSTOMER, SEED_ADMIN } from "../fixtures/test-fixtures";
import { RegisterPage } from "../pages/LoginPage";

test.describe("Đăng nhập / Đăng ký", () => {
  test("đăng nhập đúng thì về trang chủ và header đổi trạng thái", async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(SEED_CUSTOMER.email, SEED_CUSTOMER.password);

    await expect(page).toHaveURL("/");
    // Nút "Đăng nhập" biến mất, thay bằng avatar -> phiên đã được thiết lập.
    await expect(page.getByRole("link", { name: "Đăng nhập" })).toHaveCount(0);
  });

  test("sai mật khẩu thì hiện lỗi và KHÔNG điều hướng", async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(SEED_CUSTOMER.email, "mat-khau-sai-hoan-toan");

    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.errorAlert).toContainText("Email hoặc mật khẩu không đúng");
    await expect(page).toHaveURL(/\/login/);
  });

  test("email không tồn tại báo lỗi GIỐNG HỆT sai mật khẩu", async ({ loginPage }) => {
    // Bài 36 — chống user enumeration: hai trường hợp phải không phân biệt được.
    await loginPage.goto();
    await loginPage.login("khong-ton-tai@nowhere.test", "BatKyThuGi123");

    await expect(loginPage.errorAlert).toContainText("Email hoặc mật khẩu không đúng");
  });

  test("form validate phía client trước khi gọi API", async ({ page, loginPage }) => {
    let apiCalled = false;
    page.on("request", (req) => {
      if (req.url().includes("/auth/login")) apiCalled = true;
    });

    await loginPage.goto();
    await loginPage.login("khong-phai-email", "abc");

    await expect(page.getByText("Email không hợp lệ")).toBeVisible();
    expect(apiCalled, "email sai định dạng thì không được gọi API").toBe(false);
  });

  test("đăng ký tài khoản mới rồi tự đăng nhập luôn", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    // Email duy nhất cho mỗi lần chạy -> test độc lập, chạy lại được nhiều lần.
    const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.local`;

    await registerPage.goto();
    await registerPage.register({ name: "E2E Tester", email, password: "Passw0rd123" });

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "Đăng nhập" })).toHaveCount(0);
  });

  test("đăng ký trùng email hiện message của backend", async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.register({
      name: "Trùng Email",
      email: SEED_CUSTOMER.email,
      password: "Passw0rd123",
    });

    await expect(registerPage.errorAlert).toContainText(/already registered/i);
  });

  test("mật khẩu yếu bị chặn ở client", async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.register({
      name: "Mật khẩu yếu",
      email: `weak-${Date.now()}@test.local`,
      password: "abc", // thiếu độ dài, thiếu chữ hoa, thiếu số
    });

    await expect(page.getByText("Mật khẩu tối thiểu 8 ký tự")).toBeVisible();
  });

  test("phiên đăng nhập sống sót qua F5", async ({ customerPage }) => {
    await customerPage.goto("/");
    await expect(customerPage.getByRole("link", { name: "Đăng nhập" })).toHaveCount(0);

    await customerPage.reload();

    // AuthContext hydrate lại bằng GET /auth/me. Nếu ProtectedRoute không chờ `loading`
    // thì đây là chỗ user bị "đá" về /login.
    await expect(customerPage.getByRole("link", { name: "Đăng nhập" })).toHaveCount(0);
  });

  test("đăng xuất xoá token và trả lại nút Đăng nhập", async ({ customerPage }) => {
    await customerPage.goto("/");

    await customerPage.getByRole("button", { name: "Tài khoản" }).click();
    await customerPage.getByRole("menuitem", { name: "Đăng xuất" }).click();

    await expect(customerPage.getByRole("link", { name: "Đăng nhập" })).toBeVisible();
    expect(await customerPage.evaluate(() => localStorage.getItem("accessToken"))).toBeNull();
  });

  test("chỉ admin mới thấy menu Quản lý", async ({ adminPage }) => {
    await adminPage.goto("/");
    await adminPage.getByRole("button", { name: "Tài khoản" }).click();

    await expect(adminPage.getByRole("menuitem", { name: "Quản lý" })).toBeVisible();
  });

  test("customer KHÔNG thấy menu Quản lý", async ({ customerPage }) => {
    await customerPage.goto("/");
    await customerPage.getByRole("button", { name: "Tài khoản" }).click();

    await expect(customerPage.getByRole("menuitem", { name: "Quản lý" })).toHaveCount(0);
    await expect(customerPage.getByRole("menuitem", { name: "Đơn hàng của tôi" })).toBeVisible();
  });
});

test.describe("Route được bảo vệ", () => {
  test("khách vào /my-orders bị đẩy về /login", async ({ page }) => {
    await page.goto("/my-orders");
    await expect(page).toHaveURL(/\/login/);
  });

  test("khách gõ thẳng URL /admin/products bị đẩy về /login", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/login/);
  });

  test("customer gõ thẳng URL admin bị đẩy về trang chủ", async ({ customerPage }) => {
    await customerPage.goto("/admin/users");

    await expect(customerPage).toHaveURL("/");
    await expect(customerPage.getByRole("heading", { name: "Quản lý người dùng" })).toHaveCount(0);
  });

  test("admin mở được trang admin", async ({ adminPage }) => {
    await adminPage.goto("/admin/products");
    await expect(adminPage.getByRole("heading", { name: "Quản lý sản phẩm" })).toBeVisible();
  });

  test.describe("chỉ chạy với admin", () => {
    test("SEED_ADMIN thật sự có role admin", async ({ request }) => {
      const login = await request.post("http://localhost:3000/api/v1/auth/login", {
        data: SEED_ADMIN,
      });
      const body = await login.json();
      expect(body.data.user.role).toBe("admin");
    });
  });
});

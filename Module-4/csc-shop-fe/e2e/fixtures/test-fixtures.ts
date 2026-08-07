import { test as base, expect, type Page, type APIRequestContext } from "@playwright/test";

import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { MyOrdersPage } from "../pages/MyOrdersPage";
import { AdminProductsPage } from "../pages/AdminProductsPage";

export const API_URL = "http://localhost:3000/api/v1";

// Tài khoản do `npm run prisma:seed` tạo ra.
export const SEED_ADMIN = { email: "admin@cscshop.com", password: "Admin@123456" };
export const SEED_CUSTOMER = { email: "customer@cscshop.com", password: "Customer@123" };

/**
 * Đăng nhập qua API rồi nhét token vào localStorage TRƯỚC khi trang load.
 *
 * Vì sao không đăng nhập qua UI ở mọi test: điền form + chờ điều hướng tốn ~2s mỗi test
 * và làm test phụ thuộc vào giao diện login (login hỏng là 20 test đỏ cùng lúc, không
 * biết lỗi thật nằm đâu). Luồng login qua UI vẫn được test riêng ở `auth.spec.ts`.
 */
export async function authenticate(
  page: Page,
  request: APIRequestContext,
  credentials: { email: string; password: string }
) {
  const res = await request.post(`${API_URL}/auth/login`, { data: credentials });
  expect(res.ok(), `Đăng nhập thất bại cho ${credentials.email}: ${res.status()}`).toBe(true);

  const { accessToken, refreshToken } = (await res.json()).data;

  // addInitScript chạy trước mọi script của trang ở MỌI lần điều hướng — đúng thời điểm
  // AuthContext đọc localStorage để hydrate phiên.
  await page.addInitScript(
    ([access, refresh]) => {
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    },
    [accessToken, refreshToken] as const
  );
}

/**
 * Chặn API bên thứ ba của trang Checkout (provinces.open-api.vn).
 *
 * Không bao giờ để E2E phụ thuộc mạng ngoài: API đó down/chậm là suite đỏ dù code mình
 * hoàn toàn đúng. Mock lại cho dữ liệu cố định và test chạy nhanh.
 */
export async function mockProvincesApi(page: Page) {
  await page.route("**/provinces.open-api.vn/api/v2/p/", (route) =>
    route.fulfill({
      json: [
        { code: 1, name: "Hà Nội" },
        { code: 79, name: "TP Hồ Chí Minh" },
      ],
    })
  );

  await page.route("**/provinces.open-api.vn/api/v2/p/*\\?depth=2", (route) =>
    route.fulfill({
      json: {
        code: 1,
        name: "Hà Nội",
        wards: [
          { code: "00001", name: "Phường Phúc Xá" },
          { code: "00004", name: "Phường Trúc Bạch" },
        ],
      },
    })
  );
}

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  myOrdersPage: MyOrdersPage;
  adminProductsPage: AdminProductsPage;

  /** Trang đã đăng nhập sẵn bằng tài khoản customer seed. */
  customerPage: Page;
  /** Trang đã đăng nhập sẵn bằng tài khoản admin seed. */
  adminPage: Page;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  myOrdersPage: async ({ page }, use) => use(new MyOrdersPage(page)),
  adminProductsPage: async ({ page }, use) => use(new AdminProductsPage(page)),

  customerPage: async ({ page, request }, use) => {
    await authenticate(page, request, SEED_CUSTOMER);
    await use(page);
  },

  adminPage: async ({ page, request }, use) => {
    await authenticate(page, request, SEED_ADMIN);
    await use(page);
  },
});

export { expect };

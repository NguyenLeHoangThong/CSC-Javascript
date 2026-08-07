import { test, expect, mockProvincesApi } from "../fixtures/test-fixtures";
import { CheckoutPage } from "../pages/CheckoutPage";

// Luồng quan trọng nhất của cả app: xem hàng -> thêm giỏ -> thanh toán -> thấy đơn.
//
// Chính spec này phát hiện ra CheckoutPage của Module 3 gửi sai tên field
// (userName/userEmail/userPhone thay vì customerName/email/phone) nên mọi lần đặt hàng
// đều 400. Không unit test nào bắt được: FE và BE mỗi bên tự nó đều "đúng".

test.describe("Giỏ hàng", () => {
  test("giỏ trống hiện empty state", async ({ cartPage }) => {
    await cartPage.goto();
    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test("thêm sản phẩm thì badge giỏ tăng và nút đổi nhãn", async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.addToCart("iPhone 15 Pro");

    await expect(page.getByText("Đã thêm vào giỏ")).toBeVisible();
    await expect(homePage.productCard("iPhone 15 Pro").getByRole("button", { name: "Trong giỏ (1)" })).toBeVisible();
    expect(await homePage.cartCount()).toBe("1");
  });

  test("giỏ hàng sống sót qua reload (localStorage)", async ({ page, homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart("iPad Air");

    await page.reload();
    await cartPage.goto();

    await expect(cartPage.item("iPad Air")).toBeVisible();
  });

  test("thêm 2 lần thì số lượng cộng dồn, không tạo dòng mới", async ({ homePage, cartPage }) => {
    await homePage.goto();
    await homePage.addToCart("AirPods Pro 2");
    await homePage.addToCart("AirPods Pro 2");

    await cartPage.goto();
    await expect(cartPage.item("AirPods Pro 2")).toHaveCount(1);
    expect(await homePage.cartCount()).toBe("2");
  });
});

test.describe("Thanh toán", () => {
  test.beforeEach(async ({ page }) => {
    // API tỉnh/phường là bên thứ ba — mock để test không phụ thuộc mạng ngoài.
    await mockProvincesApi(page);
  });

  test("giỏ trống thì không vào được trang thanh toán", async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await expect(checkoutPage.emptyCartMessage).toBeVisible();
  });

  test("khách vãng lai (không đăng nhập) vẫn đặt hàng được", async ({ page, homePage, cartPage, checkoutPage }) => {
    // Bài 31 — Module 3 dùng `authenticate` cho POST /orders nên guest checkout bị 401
    // dù storefront quảng cáo là mua được. Giờ là `optionalAuthenticate`.
    await homePage.goto();
    await homePage.addToCart("Spigen Tough Armor Case");

    await cartPage.goto();
    await cartPage.checkoutButton.click();
    await expect(checkoutPage.heading).toBeVisible();

    await checkoutPage.fillForm({
      name: "Khách Vãng Lai",
      email: "guest@test.local",
      phone: "0901234567",
      address: "123 Đường Lê Lợi, Quận 1",
      note: "E2E guest checkout",
    });

    const orderRequest = page.waitForResponse(
      (res) => res.url().includes("/orders") && res.request().method() === "POST"
    );
    await checkoutPage.submit();
    const response = await orderRequest;

    expect(response.status(), await response.text()).toBe(201);
    await expect(checkoutPage.successAlert).toBeVisible();
  });

  test("đơn của khách gửi đúng shape backend yêu cầu", async ({ page, homePage, cartPage, checkoutPage }) => {
    await homePage.goto();
    await homePage.addToCart("Anker 65W Charger");

    await cartPage.goto();
    await cartPage.checkoutButton.click();
    await checkoutPage.fillForm({
      name: "Kiểm Tra Payload",
      email: "payload@test.local",
      phone: "0912345678",
      address: "456 Nguyễn Huệ, Quận 1",
    });

    const request = page.waitForRequest(
      (req) => req.url().includes("/orders") && req.method() === "POST"
    );
    await checkoutPage.submit();
    const body = (await request).postDataJSON();

    // Đúng tên field của orderCreateSchema...
    expect(body).toMatchObject({
      customerName: "Kiểm Tra Payload",
      email: "payload@test.local",
      phone: "0912345678",
    });
    // ...và item KHÔNG được mang giá do client tự khai (sửa giá được thì bán lỗ).
    expect(body.items[0]).toEqual({ productId: expect.any(Number), quantity: 1 });
    expect(body.items[0]).not.toHaveProperty("price");
  });

  test("người đã đăng nhập đặt hàng thì đơn hiện trong 'Đơn hàng của tôi'", async ({
    customerPage,
    myOrdersPage,
  }) => {
    await mockProvincesApi(customerPage);

    const homePage = new (await import("../pages/HomePage")).HomePage(customerPage);
    const cartPage = new (await import("../pages/CartPage")).CartPage(customerPage);
    const checkoutPage = new CheckoutPage(customerPage);

    await homePage.goto();
    await homePage.addToCart("Google Pixel 8");

    await cartPage.goto();
    await cartPage.checkoutButton.click();
    await checkoutPage.fillForm({
      name: "Demo Customer",
      email: "customer@cscshop.com",
      phone: "0987654321",
      address: "789 Trần Hưng Đạo, Quận 5",
      note: "E2E đơn của tôi",
    });

    const orderResponse = customerPage.waitForResponse(
      (res) => res.url().includes("/orders") && res.request().method() === "POST"
    );
    await checkoutPage.submit();
    const created = await (await orderResponse).json();
    const orderId = created.data.id;

    await myOrdersPage.goto();

    // Đơn phải gắn với tài khoản (userId), không phải đơn khách vãng lai.
    await expect(myOrdersPage.order(orderId)).toBeVisible();
    // Và tên sản phẩm phải hiện ra -> item.product.title được include đúng.
    await expect(myOrdersPage.order(orderId)).toContainText("Google Pixel 8");
  });

  test("giỏ được dọn sạch sau khi đặt hàng thành công", async ({ homePage, cartPage, checkoutPage }) => {
    await homePage.goto();
    await homePage.addToCart("Samsung 25W Power Bank");

    await cartPage.goto();
    await cartPage.checkoutButton.click();
    await checkoutPage.fillForm({
      name: "Dọn Giỏ",
      email: "clear@test.local",
      phone: "0909090909",
      address: "111 Hai Bà Trưng, Quận 3",
    });
    await checkoutPage.submit();
    await expect(checkoutPage.successAlert).toBeVisible();

    await cartPage.goto();
    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test("ngày giao trong quá khứ bị chặn ở client", async ({ page, homePage, cartPage, checkoutPage }) => {
    await homePage.goto();
    await homePage.addToCart("iPad Air");
    await cartPage.goto();
    await cartPage.checkoutButton.click();

    await checkoutPage.nameInput.fill("Ngày Quá Khứ");
    await checkoutPage.emailInput.fill("past@test.local");
    await checkoutPage.phoneInput.fill("0901111111");
    await checkoutPage.addressInput.fill("222 Võ Văn Tần, Quận 3");
    await checkoutPage.provinceSelect.click();
    await page.getByRole("option", { name: "Hà Nội" }).click();
    await expect(checkoutPage.wardSelect).toBeEnabled();
    await checkoutPage.wardSelect.click();
    await page.getByRole("option", { name: "Phường Phúc Xá" }).click();
    await checkoutPage.setDeliveryDate(new Date("2020-01-01"));

    await checkoutPage.submit();

    await expect(page.getByText("Delivery date must be from tomorrow")).toBeVisible();
  });
});

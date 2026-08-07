import { type Page, type Locator, expect } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly provinceSelect: Locator;
  readonly wardSelect: Locator;
  readonly deliveryDateInput: Locator;
  readonly noteInput: Locator;
  readonly submitButton: Locator;
  readonly successAlert: Locator;
  readonly errorAlert: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Thanh toán" });
    this.nameInput = page.getByLabel("Họ tên");
    this.emailInput = page.getByLabel("Email");
    this.phoneInput = page.getByLabel("Số điện thoại");
    this.addressInput = page.getByLabel("Địa chỉ");
    this.provinceSelect = page.getByLabel("Tỉnh/Thành");
    this.wardSelect = page.getByLabel("Phường/Xã");
    // MUI X DatePicker KHÔNG phải một <input> đơn giản: nó là một `role="group"` gồm
    // nhiều section (MM / DD / YYYY) cộng một input ẩn. Vì thế `getByLabel` khớp 2 phần
    // tử (strict mode violation) và `.fill()` cũng không dùng được — phải click vào
    // group rồi gõ số, field sẽ tự nhảy sang section tiếp theo.
    this.deliveryDateInput = page.getByRole("group", { name: "Ngày giao" });
    this.noteInput = page.getByLabel("Ghi chú");
    this.submitButton = page.getByRole("button", { name: /Đặt hàng|Đang đặt hàng/ });
    this.successAlert = page.getByRole("heading", { name: "Đặt hàng thành công!" });
    this.errorAlert = page.getByRole("alert");
    this.emptyCartMessage = page.getByText(/Chưa có sản phẩm trong giỏ/);
  }

  async goto() {
    await this.page.goto("/checkout");
  }

  /** Ngày giao hợp lệ: schema yêu cầu từ NGÀY MAI trở đi. */
  static tomorrow(): Date {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }

  /**
   * Điền DatePicker.
   *
   * MUI X chia field thành 3 section `role="spinbutton"` (`Month` / `Day` / `Year`),
   * mỗi cái là một `contenteditable` riêng. Click vào cả group thì không section nào
   * được focus và mọi phím gõ ra đều rơi vào hư không — phải click ĐÚNG section đầu
   * tiên; gõ xong 2 chữ số thì field tự nhảy sang section kế.
   * Locale mặc định của MUI X là en-US nên thứ tự là MM/DD/YYYY.
   */
  async setDeliveryDate(date: Date) {
    const digits = [
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
      String(date.getFullYear()),
    ].join("");

    await this.deliveryDateInput.getByRole("spinbutton", { name: "Month" }).click();
    await this.page.keyboard.type(digits);

    // Xác nhận field đã nhận giá trị trước khi đi tiếp — nếu không, submit sẽ fail với
    // "Delivery date is required" và lỗi thật bị che mất.
    await expect(this.deliveryDateInput.getByRole("spinbutton", { name: "Year" })).toHaveText(
      String(date.getFullYear())
    );
  }

  async fillForm(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.addressInput.fill(data.address);
    if (data.note) await this.noteInput.fill(data.note);

    // MUI Select là listbox tuỳ biến, không phải <select> — phải click rồi chọn option.
    await this.provinceSelect.click();
    await this.page.getByRole("option", { name: "Hà Nội" }).click();

    // Ward chỉ bật sau khi provinceCode đổi và request wards trả về.
    await expect(this.wardSelect).toBeEnabled();
    await this.wardSelect.click();
    await this.page.getByRole("option", { name: "Phường Phúc Xá" }).click();

    await this.setDeliveryDate(CheckoutPage.tomorrow());
  }

  async submit() {
    await this.submitButton.click();
  }
}

import { type Page, type Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Mật khẩu");
    this.submitButton = page.getByRole("button", { name: /Đăng nhập/ });
    // MUI <Alert severity="error"> render role="alert".
    this.errorAlert = page.getByRole("alert");
    this.registerLink = page.getByRole("link", { name: "Đăng ký" });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel("Họ tên");
    this.emailInput = page.getByLabel("Email");
    // `exact` cần thiết: "Mật khẩu" là tiền tố của "Xác nhận mật khẩu"? Không —
    // nhưng getByLabel mặc định khớp một phần nên vẫn phải chặt để khỏi dính 2 ô.
    this.passwordInput = page.getByLabel("Mật khẩu", { exact: true });
    this.confirmPasswordInput = page.getByLabel("Xác nhận mật khẩu");
    this.submitButton = page.getByRole("button", { name: /Đăng ký|Đang tạo/ });
    this.errorAlert = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(data: { name: string; email: string; password: string }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.password);
    await this.submitButton.click();
  }
}

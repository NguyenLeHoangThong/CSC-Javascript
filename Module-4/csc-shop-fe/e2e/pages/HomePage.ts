import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object cho trang chủ.
 *
 * Nguyên tắc chọn selector trong toàn bộ e2e/: ưu tiên `getByRole` / `getByLabel` —
 * đó là thứ người dùng thật (và screen reader) nhìn thấy. Selector theo class CSS gãy
 * ngay khi đổi style, mà đổi style thì không phải là hỏng chức năng.
 */
export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly sortSelect: Locator;
  readonly collectionSelect: Locator;
  readonly cartBadge: Locator;
  readonly loginButton: Locator;
  readonly userMenuButton: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder("Search products...");
    this.collectionSelect = page.getByLabel("Bộ sưu tập");
    this.categorySelect = page.getByLabel("Danh mục");
    this.sortSelect = page.getByLabel("Sắp xếp");
    this.cartBadge = page.getByRole("link", { name: "Giỏ hàng" });
    this.loginButton = page.getByRole("link", { name: "Đăng nhập" });
    // Nút avatar CHỈ xuất hiện sau khi AuthContext hydrate xong (GET /auth/me).
    // Dùng role+name để Playwright tự chờ nó — `.last()` trước đây bắt trúng nút
    // giỏ hàng khi phiên chưa kịp hydrate nên test thỉnh thoảng đỏ.
    this.userMenuButton = page.getByRole("button", { name: "Tài khoản" });
    this.emptyMessage = page.getByText("Không có sản phẩm phù hợp.");
  }

  async goto() {
    await this.page.goto("/");
    await this.waitForProducts();
  }

  /** Chờ danh sách sản phẩm render xong (không dùng waitForTimeout). */
  async waitForProducts() {
    await expect(this.page.getByRole("link", { name: /.+/ }).first()).toBeVisible();
  }

  /** Card của một sản phẩm, khoanh vùng theo tiêu đề. */
  productCard(title: string): Locator {
    // Card = phần tử cha gần nhất của link tiêu đề có chứa nút "Thêm vào giỏ".
    return this.page
      .locator(".MuiCard-root")
      .filter({ has: this.page.getByText(title, { exact: true }) });
  }

  async addToCart(title: string) {
    await this.productCard(title).getByRole("button", { name: /Thêm vào giỏ|Trong giỏ/ }).click();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
  }

  async selectCategory(name: string) {
    await this.categorySelect.click();
    await this.page.getByRole("option", { name }).click();
  }

  async openCart() {
    await this.page.goto("/cart");
  }

  /**
   * Số hiển thị trên badge giỏ hàng ("" khi giỏ trống).
   *
   * MUI không phơi nội dung badge qua role nào cả, nên đây là chỗ duy nhất trong e2e/
   * phải bám vào class. Bù lại nó được scope trong link "Giỏ hàng" nên không thể bắt
   * nhầm badge khác trên trang.
   */
  async cartCount(): Promise<string> {
    return (await this.cartBadge.locator(".MuiBadge-badge").innerText()).trim();
  }
}

import { type Page, type Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emptyMessage: Locator;
  readonly checkoutButton: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Shopping Cart" });
    this.emptyMessage = page.getByText("Your cart is empty");
    this.checkoutButton = page.getByRole("link", { name: "Proceed To Checkout" });
    this.totalLabel = page.getByText("Total", { exact: true });
  }

  async goto() {
    await this.page.goto("/cart");
  }

  /** Dòng giỏ hàng của một sản phẩm. */
  item(title: string): Locator {
    return this.page.locator(".MuiCard-root").filter({ hasText: title });
  }
}

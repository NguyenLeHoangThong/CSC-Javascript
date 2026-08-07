import { type Page, type Locator } from "@playwright/test";

export class MyOrdersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emptyMessage: Locator;
  readonly orderCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Đơn hàng của tôi" });
    this.emptyMessage = page.getByText("Bạn chưa có đơn hàng nào");
    this.orderCards = page.locator(".MuiCard-root");
  }

  async goto() {
    await this.page.goto("/my-orders");
  }

  order(id: number): Locator {
    return this.orderCards.filter({ hasText: `Đơn #${id}` });
  }
}

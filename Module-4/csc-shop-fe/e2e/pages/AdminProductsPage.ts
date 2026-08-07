import { type Page, type Locator, expect } from "@playwright/test";

export class AdminProductsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly addButton: Locator;
  readonly rows: Locator;

  // Dialog tạo/sửa
  readonly dialog: Locator;
  readonly titleInput: Locator;
  readonly priceInput: Locator;
  readonly categorySelect: Locator;
  readonly stockInput: Locator;
  readonly thumbnailInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly saveError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Quản lý sản phẩm" });
    this.addButton = page.getByRole("button", { name: "Thêm sản phẩm" });
    this.rows = page.getByRole("row");

    this.dialog = page.getByRole("dialog");
    this.titleInput = this.dialog.getByLabel("Tên sản phẩm");
    this.priceInput = this.dialog.getByLabel("Giá");
    this.categorySelect = this.dialog.getByRole("combobox");
    this.stockInput = this.dialog.getByLabel("Kho");
    this.thumbnailInput = this.dialog.getByLabel("Thumbnail URL");
    this.descriptionInput = this.dialog.getByLabel("Mô tả");
    this.saveButton = this.dialog.getByRole("button", { name: "Lưu" });
    this.cancelButton = this.dialog.getByRole("button", { name: "Hủy" });
    this.saveError = this.dialog.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/admin/products");
    await expect(this.heading).toBeVisible();
  }

  row(title: string): Locator {
    return this.rows.filter({ hasText: title });
  }

  async openCreateDialog() {
    await this.addButton.click();
    await expect(this.dialog).toBeVisible();
  }

  async fillProduct(data: {
    title: string;
    price: number;
    category: string;
    stock: number;
    thumbnail: string;
    description: string;
  }) {
    await this.titleInput.fill(data.title);
    await this.priceInput.fill(String(data.price));

    await this.categorySelect.click();
    await this.page.getByRole("option", { name: data.category }).click();

    await this.stockInput.fill(String(data.stock));
    await this.thumbnailInput.fill(data.thumbnail);
    await this.descriptionInput.fill(data.description);
  }

  async save() {
    await this.saveButton.click();
  }

  async deleteProduct(title: string) {
    // Cột hành động có 2 IconButton: [0] sửa, [1] xóa.
    await this.row(title).getByRole("button").nth(1).click();

    const confirmDialog = this.page.getByRole("dialog").filter({ hasText: "Xác nhận xóa sản phẩm?" });
    await confirmDialog.getByRole("button", { name: "Xóa" }).click();
  }
}

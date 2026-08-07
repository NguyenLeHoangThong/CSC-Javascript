import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

import ProductCard from "../ProductCard";
import { CartProvider } from "../../../context/CartProvider";
import type { Product } from "../../../types";

// Bài 32 — component testing.
//
// ProductCard needs two things from its surroundings: a Router (it renders <Link>)
// and the cart context (it dispatches ADD_TO_CART). A test that forgets either fails
// with a confusing error, so wrap once and reuse.
const renderCard = (product: Product): ReactNode =>
  render(
    <MemoryRouter>
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    </MemoryRouter>
  ) as unknown as ReactNode;

const baseProduct: Product = {
  id: 1,
  title: 'MacBook Pro 14"',
  price: 1999,
  thumbnail: "https://example.com/mbp.jpg",
  category: "laptops",
  rating: 4.5,
  ratingCount: 180,
  description: "M3 Pro, Liquid Retina XDR display.",
  brand: "Apple",
  stock: 18,
};

describe("ProductCard", () => {
  it("renders the data it was given", () => {
    renderCard(baseProduct);

    expect(screen.getByText('MacBook Pro 14"')).toBeInTheDocument();
    // Rendered through toLocaleString(), so assert on the formatted string.
    expect(screen.getByText(`${(1999).toLocaleString()}₫`)).toBeInTheDocument();
    expect(screen.getByText("(180)")).toBeInTheDocument();
  });

  it("links to its own detail page", () => {
    renderCard(baseProduct);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => expect(link).toHaveAttribute("href", "/product/1"));
  });

  // ── The conditional branch: in stock vs out of stock ──
  it("offers an enabled Add-to-cart button while stock remains", () => {
    renderCard(baseProduct);

    const button = screen.getByRole("button", { name: /thêm vào giỏ/i });
    expect(button).toBeEnabled();
  });

  it("disables the button and says so when stock is 0", () => {
    renderCard({ ...baseProduct, stock: 0 });

    const button = screen.getByRole("button", { name: /hết hàng/i });
    expect(button).toBeDisabled();
    expect(screen.queryByRole("button", { name: /thêm vào giỏ/i })).not.toBeInTheDocument();
  });

  it("treats a missing stock field as out of stock rather than assuming availability", () => {
    // `stock` is optional on the Product type; the safe default is to not sell.
    const { stock: _stock, ...withoutStock } = baseProduct;
    renderCard(withoutStock as Product);

    expect(screen.getByRole("button", { name: /hết hàng/i })).toBeDisabled();
  });

  // ── Interaction ──
  it("shows the quantity in the cart after the product is added", async () => {
    const user = userEvent.setup();
    renderCard(baseProduct);

    await user.click(screen.getByRole("button", { name: /thêm vào giỏ/i }));

    // The label switches to "Trong giỏ (1)" once the reducer has run.
    expect(await screen.findByRole("button", { name: /trong giỏ \(1\)/i })).toBeInTheDocument();
    expect(await screen.findByText(/đã thêm vào giỏ/i)).toBeInTheDocument();
  });

  it("toggles the wishlist icon when the heart is clicked", async () => {
    const user = userEvent.setup();
    renderCard(baseProduct);

    // MUI renders the icon buttons without an accessible name, so target the last one.
    const buttons = screen.getAllByRole("button");
    const heart = buttons[buttons.length - 1];

    await user.click(heart);

    // Wishlisted state is persisted by CartProvider under this key.
    expect(JSON.parse(localStorage.getItem("csc-shop-state") ?? "{}").wishlistItems).toContain(1);
  });
});

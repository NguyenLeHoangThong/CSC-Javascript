import { useState, useEffect } from "react";
import { fetchProducts } from "../products";
import ProductCard from "../components/product/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

function HomePage() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleToggleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (priceRange === "under10") return p.price < 10000000;
      if (priceRange === "10to20") return p.price >= 10000000 && p.price <= 20000000;
      if (priceRange === "over20") return p.price > 20000000;
      return true;
    })
    .sort((a, b) => {
      if (sort === "priceAsc") return a.price - b.price;
      if (sort === "priceDesc") return b.price - a.price;
      return 0;
    });

  if (loading) return <div style={{ padding: 40 }}><p>Loading...</p></div>;
  if (error) return <div style={{ padding: 40 }}><p style={{ color: "#e53935" }}>{error}</p></div>;

  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 16px" }}>
      <h1>CSC Shop</h1>
<h2>Fast shipping, curated products, and a floral-themed modern shopping experience.</h2>
      <div style={{ marginBottom: 12 }}>
        <SearchBar value={search} onChange={setSearch} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <FilterBar priceRange={priceRange} onPriceChange={setPriceRange} sort={sort} onSortChange={setSort} />
      </div>
      <div style={{ marginBottom: 12, fontSize: 14, color: "#666" }}>
        Wishlist: {favoriteIds.length} &nbsp;|&nbsp; Result: {filteredProducts.length} products
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {filteredProducts.length === 0 ? (
          <p style={{ color: "#999", fontStyle: "italic" }}>No products match current filters.</p>
        ) : (
          filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;

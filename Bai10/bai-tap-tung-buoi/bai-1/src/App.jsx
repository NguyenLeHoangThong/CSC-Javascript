import { products } from "./products";
import ProductCard from "./components/product/ProductCard";

function App() {
  return (
    <div style={{ maxWidth: 900, margin: '40px auto' }}>
      <h1>CSC Shop</h1>
<h2>Fast shipping, curated products, and a floral-themed modern shopping experience.</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
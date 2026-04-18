import { Link, useNavigate } from "react-router-dom";

const PRODUCTS = [
  { id: "p1", name: "iPhone 15 Pro", price: "29.000.000đ" },
  { id: "p2", name: "Macbook M3", price: "35.000.000đ" },
  { id: "p3", name: "Apple Watch", price: "12.000.000đ" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Sản phẩm mới nhất</h2>
      <div className="product-grid">
        {PRODUCTS.map(p => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p>{p.price}</p>
            <Link to={`/product/${p.id}`} style={{color: '#0984e3'}}>Xem chi tiết</Link>
          </div>
        ))}
      </div>

      <button className="btn-admin" onClick={() => navigate("/admin")}>
        🚀 Vào trang Quản trị (Admin)
      </button>
    </div>
  );
}
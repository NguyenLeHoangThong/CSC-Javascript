import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => (
  <div className="product-card" style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, textAlign: "center", margin: 8, background: "#fff" }}>
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <img src={product.image} alt={product.name} width={200} style={{ borderRadius: 4 }} />
      <h3 style={{ fontSize: 15, margin: "10px 0 4px" }}>{product.name}</h3>
    </Link>
    <p style={{ color: "#e53935", fontWeight: 600, margin: "4px 0 10px" }}>
      {product.price.toLocaleString("vi-VN")}₫
    </p>
    <button
      onClick={() => onToggleFavorite(product.id)}
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}
    >
      {isFavorite ? <FaHeart color="red" /> : <FaRegHeart color="#aaa" />}
    </button>
  </div>
);

export default ProductCard;

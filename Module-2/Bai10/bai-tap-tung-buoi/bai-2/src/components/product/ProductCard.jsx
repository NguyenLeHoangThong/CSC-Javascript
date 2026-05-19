import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => (
  <div className="product-card" style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, textAlign: 'center', margin: 8 }}>
    <img src={product.image} alt={product.name} width={200} style={{ borderRadius: 4 }} />
    <h3>{product.name}</h3>
    <p>{product.price.toLocaleString()}₫</p>
    <button onClick={() => onToggleFavorite(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
      {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
    </button>
  </div>
);

export default ProductCard;

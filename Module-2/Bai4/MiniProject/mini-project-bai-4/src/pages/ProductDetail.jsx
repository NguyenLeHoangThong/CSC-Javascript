import { useParams, Link } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="product-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Thông tin chi tiết</h2>
      <div style={{ fontSize: '1.2rem', margin: '20px 0' }}>
        Đang hiển thị sản phẩm có ID: <strong style={{ color: '#e67e22' }}>{id}</strong>
      </div>
      <p>Đây là trang được render động dựa trên ID từ thanh địa chỉ URL.</p>
      <Link to="/" style={{ color: '#0984e3' }}>← Back danh sách</Link>
    </div>
  );
}
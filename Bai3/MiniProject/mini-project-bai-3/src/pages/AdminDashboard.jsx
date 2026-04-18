export default function AdminDashboard() {
  return (
    <div>
      <h2 style={{ color: '#2c3e50' }}>Bảng điều khiển hệ thống</h2>
      <div className="product-grid">
        <div className="product-card" style={{ borderTop: '4px solid #1abc9c' }}>
          <h3>1,250</h3>
          <p>Đơn hàng mới</p>
        </div>
        <div className="product-card" style={{ borderTop: '4px solid #3498db' }}>
          <h3>$15,200</h3>
          <p>Doanh thu tháng</p>
        </div>
        <div className="product-card" style={{ borderTop: '4px solid #e74c3c' }}>
          <h3>45</h3>
          <p>Sản phẩm sắp hết</p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export default function AdminProducts() {
  const inventory = [
    { id: "p1", name: "iPhone 15 Pro", stock: 15, status: "Còn hàng" },
    { id: "p2", name: "Macbook M3", stock: 5, status: "Sắp hết" },
    { id: "p3", name: "Apple Watch", stock: 0, status: "Hết hàng" },
    { id: "p4", name: "AirPods Pro", stock: 50, status: "Còn hàng" },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>Quản lý kho hàng</h2>
        <button style={{ 
          padding: '10px 15px', 
          background: '#1abc9c', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          + Thêm sản phẩm mới
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '15px', borderBottom: '2px solid #eee' }}>Mã SP</th>
            <th style={{ padding: '15px', borderBottom: '2px solid #eee' }}>Tên sản phẩm</th>
            <th style={{ padding: '15px', borderBottom: '2px solid #eee' }}>Số lượng</th>
            <th style={{ padding: '15px', borderBottom: '2px solid #eee' }}>Trạng thái</th>
            <th style={{ padding: '15px', borderBottom: '2px solid #eee' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '15px' }}>{item.id}</td>
              <td style={{ padding: '15px', fontWeight: 'bold' }}>{item.name}</td>
              <td style={{ padding: '15px' }}>{item.stock}</td>
              <td style={{ padding: '15px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  background: item.stock > 10 ? '#d1fae5' : item.stock > 0 ? '#fef3c7' : '#fee2e2',
                  color: item.stock > 10 ? '#065f46' : item.stock > 0 ? '#92400e' : '#991b1b'
                }}>
                  {item.status}
                </span>
              </td>
              <td style={{ padding: '15px' }}>
                <button style={{ color: '#0984e3', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Sửa</button>
                <button style={{ color: '#d63031', background: 'none', border: 'none', cursor: 'pointer' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
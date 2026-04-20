import React from 'react';
import ProductItem from './components/ProductItem';
import './App.css';

function App() {
  // 1. Tạo mảng danh sách sản phẩm
  const products = [
    { id: 1, name: "Bàn phím cơ", price: 1500000 },
    { id: 2, name: "Chuột không dây", price: 150000 },
    { id: 3, name: "Tai nghe Gaming", price: 850000 },
    { id: 4, name: "Lót chuột", price: 50000 },
    { id: 5, name: "Màn hình 24 inch", price: 3200000 },
  ];

  return (
    <div className="container">
      <h2>Sản phẩm cao cấp ({'>'} 200,000 VNĐ)</h2>
      
      <div className="product-list">
        {products
          // Bước 1: Lọc các sản phẩm có giá > 200000
          .filter(product => product.price > 200000)
          // Bước 2: Render các sản phẩm đã lọc thành Component
          .map(product => (
            <ProductItem 
              key={product.id} 
              name={product.name} 
              price={product.price} 
            />
          ))
        }
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import Product from './components/Product';
import './App.css';

function App() {
  // Mảng dữ liệu sản phẩm
  const products = [
    { 
      id: 1, 
      name: "Iphone 14 Pro Max", 
      price: "1000", 
      img: "https://cdn.phuckhangmobile.com/image/iphone-14-pro-tim-26581j.jpg" 
    },
    { 
      id: 2, 
      name: "Macbook Pro 16 inch", 
      price: "2500", 
      img: "https://bizweb.dktcdn.net/thumb/1024x1024/100/318/659/products/macbook-pro-2021-16-inch-chip-m1-space-gray-00-1400x1400-jpeg-5064a50a-ae56-418f-b833-11cd1896ea79-74336734-3718-4327-9e5f-4bc8db9b897a.jpg?v=1646286968303" 
    },
    { 
      id: 3, 
      name: "Apple Watch Series 7", 
      price: "500", 
      img: "https://cdn.phuckhangmobile.com/image/apple-watch-s7-lte-vang-900-24676j.jpg" 
    },
  ];

  return (
    <div className="container">
      <div className="product-grid">
        {/* Render danh sách sản phẩm bằng map */}
        {products.map((item) => (
          <Product key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
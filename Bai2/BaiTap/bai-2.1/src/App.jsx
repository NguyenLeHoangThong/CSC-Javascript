import React, { useState } from 'react';
import './App.css';

function App() {
  // 1. Tạo state để quản lý việc hiển thị (mặc định là true - đang hiện)
  const [isVisible, setIsVisible] = useState(true);

  // 2. Hàm xử lý khi bấm nút
  const handleToggle = () => {
    setIsVisible(!isVisible); // Đảo ngược giá trị hiện tại (true thành false và ngược lại)
  };

  return (
    <div className="container">
      <div className="card">
        {/* 3. Render có điều kiện bằng toán tử && */}
        {isVisible && <h1 className="text-display">Xin chào React</h1>}
        
        <button 
          className={`toggle-btn ${isVisible ? 'btn-hide' : 'btn-show'}`} 
          onClick={handleToggle}
        >
          {isVisible ? 'Ẩn nội dung' : 'Hiện nội dung'}
        </button>
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import UserGreeting from './components/UserGreeting';
import './App.css';

function App() {
  // 1. Tạo biến isLoggedIn dạng boolean
  const isLoggedIn = true; // Thay đổi thành false để kiểm tra kết quả khác

  return (
    <div className="container">
      <h1>Hệ thống thông báo</h1>
      <hr />
      
      {/* Gọi component con và truyền biến vào */}
      <UserGreeting isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default App;
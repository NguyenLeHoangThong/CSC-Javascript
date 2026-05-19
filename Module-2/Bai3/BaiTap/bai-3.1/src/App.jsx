import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState("");

  // Logic 1: Hiển thị alert chào mừng khi trang vừa tải xong
  useEffect(() => {
    alert("Chào mừng bạn đến với lớp học React!");
  }, []); // Mảng phụ thuộc rỗng giúp effect này chỉ chạy 1 lần duy nhất

  // Logic 2: Thay đổi tiêu đề tab trình duyệt theo tên người dùng
  useEffect(() => {
    if (name.trim() !== "") {
      document.title = `Đang chat với: ${name}`;
    } else {
      document.title = "Lớp học React";
    }
  }, [name]); // Effect này chạy lại mỗi khi biến 'name' thay đổi

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Bài 1: Lời chào thân thiện</h1>
        
        <div className="input-wrapper">
          <input
            type="text"
            className="name-input"
            placeholder="Nhập tên của bạn..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {name && (
          <p className="display-text">
            Bạn đang nhập: <strong>{name}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import './App.css';

function App() {
  // 1. Danh sách dữ liệu cho sẵn
  const data = ["React", "NodeJS", "JavaScript", "HTML", "CSS"];

  // 2. State lưu trữ từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Logic lọc danh sách theo keyword
  // Sử dụng .toLowerCase() để tìm kiếm không phân biệt chữ hoa/thường
  const filteredList = data.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="wrapper">
      <div className="search-card">
        <h3 className="title">Tìm kiếm</h3>
        
        <input
          type="text"
          className="search-input"
          placeholder="Nhập từ khóa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="result-list">
          {filteredList.length > 0 ? (
            filteredList.map((item, index) => (
              <p key={index} className="result-item">{item}</p>
            ))
          ) : (
            <p className="no-result">Không tìm thấy kết quả</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
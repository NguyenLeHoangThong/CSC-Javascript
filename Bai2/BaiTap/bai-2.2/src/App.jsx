import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const charCount = text.length;

  return (
    <div className="wrapper">
      <div className="char-counter-card">
        <h3 className="title">Đếm số ký tự</h3>
        
        <input
          type="text"
          className={`input-field ${charCount > 20 ? 'input-error' : ''}`}
          placeholder="Nhập nội dung..."
          value={text}
          onChange={handleChange}
        />

        <p className="count-text">Số ký tự: {charCount}</p>

        {/* Hiển thị lỗi nếu vượt quá 20 ký tự */}
        {charCount > 20 && (
          <p className="error-message">Nội dung quá dài</p>
        )}
      </div>
    </div>
  );
}

export default App;
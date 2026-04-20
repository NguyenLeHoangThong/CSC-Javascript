import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Khởi tạo state: Lấy dữ liệu từ localStorage ngay khi load trang
  // Nếu chưa có dữ liệu, mặc định là chuỗi rỗng
  const [note, setNote] = useState(() => {
    const savedNote = localStorage.getItem('userNote');
    return savedNote ? savedNote : "";
  });

  // Mỗi khi biến 'note' thay đổi, useEffect sẽ tự động chạy để lưu vào localStorage
  useEffect(() => {
    localStorage.setItem('userNote', note);
  }, [note]);

  return (
    <div className="container">
      <div className="note-card">
        <h2 className="title">Bài 2: Ghi chú tự động lưu</h2>
        
        <textarea
          className="note-area"
          placeholder="Viết ghi chú của bạn tại đây..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        
        <p className="status-text">
          {note.length > 0 ? "✅ Đã tự động lưu vào trình duyệt" : "Chưa có nội dung"}
        </p>
      </div>
    </div>
  );
}

export default App;
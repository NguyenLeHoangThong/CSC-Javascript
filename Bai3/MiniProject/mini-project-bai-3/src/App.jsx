import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(10);
  const [isVisible, setIsVisible] = useState(true);

  // Logic 1: Hiển thị alert khi vừa mở trang
  useEffect(() => {
    alert("🔥 CHƯƠNG TRÌNH FLASH SALE BẮT ĐẦU!");
  }, []);

  // Logic 2: Bộ đếm ngược + Cleanup Function
  useEffect(() => {
    if (count === 0 || !isVisible) return;

    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
      console.log("Đồng hồ đang đếm ngược: ", count - 1);
    }, 1000);

    // Cleanup: Dọn dẹp khi component ẩn hoặc count thay đổi
    return () => {
      clearInterval(timer);
      console.log("Đã dọn dẹp bộ đếm!");
    };
  }, [count, isVisible]);

  // Logic 3: Thay đổi document.title
  useEffect(() => {
    if (count === 0) {
      document.title = "HẾT GIỜ SĂN DEAL!";
    } else {
      document.title = `Còn ${count} giây`;
    }
  }, [count]);

  return (
    <div className="app-wrapper">
      <div className="deal-card">
        <h2 className="deal-title">SĂN DEAL HOT ⚡</h2>

        {isVisible ? (
          <>
            <p className="deal-status">Chương trình kết thúc sau:</p>
            <div className={`countdown-number ${count === 0 ? 'red-text' : ''}`}>
              {count} giây
            </div>
            {count === 0 && <p className="expire-text">Hết thời gian săn deal!</p>}
            <button className="close-btn" onClick={() => setIsVisible(false)}>
              Đóng Deal
            </button>
          </>
        ) : (
          <>
            <p className="missed-text">Bạn đã bỏ lỡ cơ hội này!</p>
            <button className="reset-btn" onClick={() => {
              setIsVisible(true);
              setCount(10);
            }}>
              Mở lại Deal mới
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
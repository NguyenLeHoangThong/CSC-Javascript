import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [seconds, setSeconds] = useState(0); // Lưu số giây
  const [isRunning, setIsRunning] = useState(true); // Trạng thái chạy/dừng

  useEffect(() => {
    let timer;

    // Chỉ thiết lập bộ đếm nếu trạng thái isRunning là true
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
        console.log("Đồng hồ đang chạy...");
      }, 1000);
    }

    // Cleanup Function: Quan trọng nhất để xóa bỏ bộ đếm (clearInterval)
    // Hàm này chạy khi isRunning thay đổi hoặc khi Component bị tắt
    return () => {
      if (timer) {
        clearInterval(timer);
        console.log("Đã clearInterval - Tiết kiệm tài nguyên!");
      }
    };
  }, [isRunning]); // Lắng nghe sự thay đổi của isRunning

  return (
    <div className="wrapper">
      <div className="stopwatch-card">
        <h2 className="title">Đồng hồ đếm giây</h2>
        
        <div className="timer-display">
          {seconds} <span>s</span>
        </div>

        <div className="controls">
          {isRunning ? (
            <button className="btn pause" onClick={() => setIsRunning(false)}>
              Tạm dừng
            </button>
          ) : (
            <button className="btn resume" onClick={() => setIsRunning(true)}>
              Tiếp tục
            </button>
          )}
          
          <button className="btn reset" onClick={() => {
            setIsRunning(false);
            setSeconds(0);
          }}>
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
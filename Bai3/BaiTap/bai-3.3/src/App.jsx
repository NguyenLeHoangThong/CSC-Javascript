import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Khởi tạo state với chiều rộng hiện tại của cửa sổ
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // 2. Hàm cập nhật lại state khi kích thước thay đổi
    const handleResize = () => {
      setWidth(window.innerWidth);
      console.log("Đang thay đổi kích thước: ", window.innerWidth);
    };

    // 3. Đăng ký sự kiện 'resize' của trình duyệt
    window.addEventListener('resize', handleResize);

    // 4. Cleanup Function: Gỡ bỏ sự kiện khi Component bị tắt (Unmount)
    return () => {
      window.removeEventListener('resize', handleResize);
      console.log("Đã gỡ bỏ lắng nghe sự kiện resize!");
    };
  }, []); // [] đảm bảo việc đăng ký sự kiện chỉ diễn ra 1 lần duy nhất

  // Xác định loại màn hình dựa trên logic cơ bản
  const getDeviceType = () => {
    if (width <= 768) return "Màn hình Mobile";
    if (width <= 1024) return "Màn hình Tablet";
    return "Màn hình Desktop";
  };

  return (
    <div className="container">
      <div className="monitor-card">
        <h2 className="title">Bài 3: Theo dõi kích cỡ màn hình</h2>
        
        <div className={`width-display ${width <= 768 ? 'mobile-color' : 'desktop-color'}`}>
          {width}px
        </div>
        
        <p className="device-type">{getDeviceType()}</p>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import './App.css';

function App() {
  // 1. Khai báo 2 state như gợi ý
  const [task, setTask] = useState(""); // Lưu nội dung đang nhập
  const [list, setList] = useState([]); // Lưu danh sách các công việc

  // Hàm xử lý khi nhấn nút "Thêm"
  const handleAddTask = () => {
    if (task.trim() !== "") {
      // Thêm task mới vào đầu danh sách (spread operator)
      setList([task, ...list]);
      // Sau khi thêm -> clear input
      setTask("");
    }
  };

  return (
    <div className="wrapper">
      <div className="todo-card">
        <h3 className="title">Danh sách công việc</h3>
        
        <div className="input-group">
          <input
            type="text"
            className="todo-input"
            placeholder="Nhập công việc..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button className="add-button" onClick={handleAddTask}>
            Thêm
          </button>
        </div>

        <div className="task-list">
          {list.map((item, index) => (
            <div key={index} className="task-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
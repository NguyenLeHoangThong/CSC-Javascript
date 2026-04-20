import React from 'react';
import UserItem from './components/UserItem';
import './App.css';

function App() {
  // 1. Tạo mảng danh sách tên người dùng
  const users = ["John Doe", "Jane Smith", "Alice Johnson"];

  return (
    <div className="container">
      <h1 className="title">Danh sách người dùng</h1>
      
      <ul className="user-list">
        {/* 2. Dùng .map() để render ra nhiều UserItem */}
        {users.map((user, index) => (
          <UserItem key={index} name={user} />
        ))}
      </ul>
    </div>
  );
}

export default App;
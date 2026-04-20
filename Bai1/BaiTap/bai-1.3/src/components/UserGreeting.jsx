import React from 'react';

const UserGreeting = ({ isLoggedIn }) => {
  // Gợi ý: Sử dụng "if" để kiểm tra và "return" phù hợp
  if (isLoggedIn) {
    return <h2 className="status-success">Xin chào user!</h2>;
  }

  return <h2 className="status-error">Vui lòng đăng nhập.</h2>;
};

export default UserGreeting;
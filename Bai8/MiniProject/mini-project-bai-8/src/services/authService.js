
// Giả lập cơ sở dữ liệu user
const MOCK_USER = {
  email: "admin@gmail.com",
  password: "password123",
  name: "Quản trị viên",
  avatar: "https://i.pravatar.cc/150?u=admin"
};

export const authService = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === MOCK_USER.email && password === MOCK_USER.password) {
          const userData = { email: MOCK_USER.email, name: MOCK_USER.name, avatar: MOCK_USER.avatar };
          localStorage.setItem("user", JSON.stringify(userData));
          resolve(userData);
        } else {
          reject("Email hoặc mật khẩu không chính xác!");
        }
      }, 1500); // Giả lập lag mạng 1.5s
    });
  },
  logout: () => {
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
};
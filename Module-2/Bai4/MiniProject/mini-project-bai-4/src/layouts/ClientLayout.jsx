import { Outlet, Link } from "react-router-dom";

export default function ClientLayout() {
  return (
    <div className="client-wrapper">
      <header className="client-header">
        <div className="logo">
          <Link to="/"> 🛒 TECH STORE</Link>
        </div>
        <nav className="client-nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/admin">Vào Admin</Link>
        </nav>
      </header>

      <main className="main-content">
        {/* Nơi hiển thị Home hoặc ProductDetail */}
        <Outlet />
      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '20px', 
        background: '#eee',
        marginTop: '40px' 
      }}>
        <p>© 2024 React Router v7 Mini Project</p>
      </footer>
    </div>
  );
}
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className="hr-container">
      <header className="topbar">
        <div className="logo" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
          🏢 HR MANAGER
        </div>
        <nav className="top-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/employees">Nhân sự</Link>
          <button className="logout-btn" onClick={() => alert("Đăng xuất thành công!")}>Đăng xuất</button>
        </nav>
      </header>
      
      <main className="main-body">
        <Outlet /> 
      </main>
    </div>
  );
}
import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>STORE ADMIN</h2>
        <nav>
          <NavLink to="/admin" end className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
            📦 Quản lý kho
          </NavLink>
          <NavLink to="/" className="sidebar-link" style={{marginTop: 'auto', borderTop: '1px solid #444'}}>
            🏠 Thoát ra Web
          </NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <header style={{marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
          <span>Xin chào, <strong>Quản trị viên</strong></span>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <header style={{ background: "#0B74E5", color: "#fff", padding: "12px 24px", display: "flex", gap: 24, alignItems: "center" }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 20 }}>
        CSC Shop
      </Link>
      <Link to="/cart" style={{ color: "#fff", textDecoration: "none", marginLeft: "auto" }}>
        🛒 Shopping Cart
      </Link>
    </header>

    <main style={{ flex: 1 }}>
      <Outlet />
    </main>

    <footer style={{ background: "#333", color: "#fff", textAlign: "center", padding: "16px" }}>
      © 2025 CSC Shop
    </footer>
  </div>
);

export default MainLayout;

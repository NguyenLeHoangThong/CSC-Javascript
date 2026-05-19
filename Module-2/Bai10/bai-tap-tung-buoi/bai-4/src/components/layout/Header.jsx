import { Link } from "react-router-dom";
import SearchBar from "../SearchBar";

const Header = ({ search, setSearch }) => (
  <header style={{ background: "#0B74E5", color: "#fff", padding: "12px 24px", display: "flex", gap: 24, alignItems: "center" }}>
    <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 20 }}>
      CSC Shop
    </Link>
    <div style={{ flex: 1, maxWidth: 400 }}>
      <SearchBar value={search} onChange={setSearch} />
    </div>
    <Link to="/cart" style={{ color: "#fff", textDecoration: "none", marginLeft: "auto", fontSize: 20 }}>
      🛒 Shopping Cart
    </Link>
  </header>
);

export default Header;

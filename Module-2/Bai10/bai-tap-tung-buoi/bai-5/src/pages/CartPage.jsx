import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
      <h2>Shopping Cart</h2>
      <p style={{ color: "#999" }}>Tính năng Shopping Cart sẽ được xây dựng ở bài 8.</p>
      <Link to="/checkout">
        <button style={{ padding: "10px 24px", background: "#0B74E5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Proceed to checkout →
        </button>
      </Link>
    </div>
  );
}

export default CartPage;

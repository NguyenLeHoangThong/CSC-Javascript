import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../products";
import { useState, useEffect } from "react";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      const found = data.find((p) => p.id === Number(id));
      setProduct(found ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div style={{ padding: 40 }}><p>Đang tải...</p></div>;

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <p>Không tìm thấy sản phẩm.</p>
        <button onClick={() => navigate("/")}>Về trang chủ</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <img src={product.image} alt={product.name} style={{ width: 300, borderRadius: 8 }} />
        <div>
          <h2>{product.name}</h2>
          <p style={{ color: "#e53935", fontSize: 24, fontWeight: 700 }}>
            {product.price.toLocaleString("vi-VN")}₫
          </p>
          <p style={{ color: "#555", lineHeight: 1.6 }}>{product.description || "Sản phẩm chất lượng cao."}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;

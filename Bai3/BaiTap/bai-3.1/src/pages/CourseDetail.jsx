import { useParams, useNavigate } from "react-router-dom";

export default function CourseDetail() {
  // 1. Lấy tham số courseName từ URL
  const { courseName } = useParams();
  const navigate = useNavigate();

  const handleRegister = () => {
    // 2. Xử lý logic thông báo
    alert(`Cảm ơn bạn đã đăng ký khóa học ${courseName}!`);
    
    // 3. Điều hướng chủ động về trang chủ
    navigate("/");
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "Arial" }}>
      <h2 style={{ fontSize: "30px" }}>
        Chi tiết khóa học: <span style={{ color: "#e67e22" }}>{courseName}</span>
      </h2>
      <p>Học lập trình chuyên sâu cùng các chuyên gia hàng đầu.</p>
      
      <div style={{ marginTop: "30px" }}>
        <button 
          onClick={() => navigate("/")}
          style={{ marginRight: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          Quay lại
        </button>

        <button 
          onClick={handleRegister}
          style={{ 
            padding: "10px 20px", 
            background: "#27ae60", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer" 
          }}
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}
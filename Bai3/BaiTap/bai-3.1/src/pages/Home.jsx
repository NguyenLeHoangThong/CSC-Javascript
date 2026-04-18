import { Link } from "react-router-dom";

export default function Home() {
  const courses = ["React", "Nodejs", "Javascript", "Design"];

  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial" }}>
      <h1 style={{ color: "#2c3e50" }}>Chào mừng đến với Academy</h1>
      <p>Chọn một khóa học để xem chi tiết:</p>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
        {courses.map((name) => (
          <Link 
            key={name} 
            to={`/courses/${name}`}
            style={{
              padding: "15px 25px",
              background: "#3498db",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none"
            }}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
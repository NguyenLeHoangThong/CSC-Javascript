import { Outlet, NavLink } from "react-router-dom";

export default function EmployeeLayout() {
  return (
    <div className="employee-wrapper">
      <aside className="sub-sidebar">
        <h3>Quản lý Nhân sự</h3>
        <NavLink to="/employees" end className={({isActive}) => isActive ? "sub-link active" : "sub-link"}>
          👥 Danh sách nhân viên
        </NavLink>
        <NavLink to="/employees/salary" className={({isActive}) => isActive ? "sub-link active" : "sub-link"}>
          💰 Bảng lương
        </NavLink>
      </aside>

      <section className="employee-content">
        <Outlet /> {/* Nội dung EmployeeList hoặc SalaryPage sẽ hiện ở đây */}
      </section>
    </div>
  );
}
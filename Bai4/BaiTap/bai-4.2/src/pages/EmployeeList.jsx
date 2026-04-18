export default function EmployeeList() {
  const staff = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];
  return (
    <div>
      <h2>Danh sách nhân viên</h2>
      <ul>
        {staff.map((name, i) => <li key={i} className="list-item">{name}</li>)}
      </ul>
    </div>
  );
}
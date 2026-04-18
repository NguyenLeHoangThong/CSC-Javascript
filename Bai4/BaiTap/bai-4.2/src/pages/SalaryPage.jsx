export default function SalaryPage() {
  return (
    <div>
      <h2>Bảng lương nhân viên</h2>
      <p>Dữ liệu lương tháng 04/2026...</p>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tr><th>Tên</th><th>Lương Cơ Bản</th></tr>
        <tr><td>Nguyễn Văn A</td><td>20.000.000đ</td></tr>
      </table>
    </div>
  );
}
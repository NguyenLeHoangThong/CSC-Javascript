export default function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Tổng</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="card">Tổng nhân viên: 150</div>
        <div className="card">Tháng này: +5</div>
      </div>
    </div>
  );
}
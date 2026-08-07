import { Box, Chip, Container, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import Loading from "../../components/common/Loading";
import { orderApi } from "../../api/orderApi";
import type { Order } from "../../types/order";

// Bài 31 — must mirror the backend `OrderStatus` enum exactly; the old list made
// every status change fail validation with 400 "Invalid status".
const STATUS_OPTIONS = ["pending", "paid", "shipped", "completed", "cancelled"] as const;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<(Order & { userName: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => orderApi.getAll({ limit: 100 }).then((res) => setOrders(res.data.data));

  useEffect(() => {
    loadOrders().finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Quản lý đơn hàng</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell><TableCell>Khách</TableCell><TableCell>Tổng</TableCell>
            <TableCell>Ngày</TableCell><TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.userName}</TableCell>
              <TableCell>{Number(o.totalAmount).toLocaleString()}₫</TableCell>
              <TableCell>{new Date(o.createdAt).toLocaleDateString("vi-VN")}</TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={o.status}
                  onChange={async (e) => {
                    await orderApi.updateStatus(o.id, e.target.value);
                    loadOrders();
                  }}
                >
                  {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orders.length === 0 && <Box sx={{ mt: 3 }}><Chip label="Chưa có đơn hàng" /></Box>}
    </Container>
  );
};

export default AdminOrdersPage;

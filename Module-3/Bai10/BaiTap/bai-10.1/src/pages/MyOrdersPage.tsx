import { Box, Card, CardContent, Chip, Container, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";
import BackButton from "../components/common/BackButton";
import { orderApi } from "../api/orderApi";
import type { Order } from "../types/order";

const STATUS_COLOR: Record<string, "warning" | "info" | "success" | "error" | "default"> = {
  pending: "warning",
  confirmed: "info",
  shipping: "info",
  delivered: "success",
  cancelled: "error",
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders().then((res) => setOrders(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (orders.length === 0) return <EmptyState message="Bạn chưa có đơn hàng nào" showBackHome />;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Box sx={{ mb: 2.5 }}><BackButton /></Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Đơn hàng của tôi</Typography>
      <Stack spacing={2}>
        {orders.map((order) => (
          <Card key={order.id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography fontWeight={700}>Đơn #{order.id}</Typography>
                <Chip label={order.status} color={STATUS_COLOR[order.status] ?? "default"} size="small" />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={0.5}>
                {order.items.map((item) => (
                  <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">{item.title} × {item.quantity}</Typography>
                    <Typography variant="body2">{(Number(item.price) * item.quantity).toLocaleString()}₫</Typography>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Typography textAlign="right" fontWeight={700}>Tổng: {Number(order.totalAmount).toLocaleString()}₫</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default MyOrdersPage;

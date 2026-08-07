import { Box, Card, CardContent, Chip, Container, Divider, Stack, Typography } from "@mui/material";

import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";
import BackButton from "../components/common/BackButton";
import { useFetch } from "../hooks/useFetch";
import type { Order } from "../types/order";

// Bài 31 — these keys must match the backend `OrderStatus` enum
// (pending | paid | shipped | completed | cancelled). Module 3 listed
// confirmed/shipping/delivered, which never matched, so every chip fell back to grey.
const STATUS_COLOR: Record<string, "warning" | "info" | "success" | "error" | "default"> = {
  pending: "warning",
  paid: "info",
  shipped: "info",
  completed: "success",
  cancelled: "error",
};

const MyOrdersPage = () => {
  // Bài 34 — was three useStates + a useEffect with no error branch: a failed request
  // left the page stuck on "Loading..." forever. `useFetch` handles loading, error and
  // abort-on-unmount in one line.
  const { data: orders, loading, error } = useFetch<Order[]>("/orders/me");

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} showBackHome />;
  if (!orders || orders.length === 0) return <EmptyState message="Bạn chưa có đơn hàng nào" showBackHome />;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Box sx={{ mb: 2.5 }}><BackButton /></Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Đơn hàng của tôi</Typography>
      <Stack spacing={2}>
        {orders.map((order) => (
          <Card key={order.id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>Đơn #{order.id}</Typography>
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
              <Typography sx={{ textAlign: "right", fontWeight: 700 }}>Tổng: {Number(order.totalAmount).toLocaleString()}₫</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default MyOrdersPage;

import { Box, Chip, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import BackButton from "../components/common/BackButton";
import EmptyState from "../components/common/EmptyState";
import Loading from "../components/common/Loading";

import { getMyOrders } from "../services/orderService";
import type { Order } from "../types/order";

// Color the status chip so the order state is easy to scan.
const statusColor: Record<string, "default" | "warning" | "info" | "success" | "error"> = {
  pending: "warning",
  paid: "info",
  shipped: "info",
  completed: "success",
  cancelled: "error",
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setError("Cannot load your orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;
  if (orders.length === 0) return <EmptyState message="You have no orders yet." showBackHome />;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Box sx={{ mb: 2.5 }}>
        <BackButton />
      </Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        My Orders
      </Typography>

      <Stack spacing={2}>
        {orders.map((order) => (
          <Paper key={order.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography fontWeight={700}>Order #{order.id}</Typography>
              <Chip label={order.status} color={statusColor[order.status] ?? "default"} size="small" />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {new Date(order.createdAt).toLocaleString()}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Stack spacing={0.5}>
              {order.items.map((item) => (
                <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">
                    {item.product?.title ?? `Product #${item.productId}`} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">${(Number(item.price) * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 1.5 }} />
            <Typography textAlign="right" fontWeight={700}>
              Total: ${Number(order.totalAmount).toFixed(2)}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default MyOrdersPage;

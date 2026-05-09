import { Box, CircularProgress, Container, Grid, Typography, Alert } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { useApi } from "../hooks/useApi";
import type { Product } from "../types/cart";

// Dùng useApi với discriminated union — không cần 3 state riêng lẻ
const ShoppingPage = () => {
  const state = useApi<Product[]>("https://fakestoreapi.com/products?limit=8");

  // TypeScript thu hẹp type trong mỗi nhánh
  if (state.status === "idle" || state.status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (state.status === "error") {
    // state.error tồn tại — TypeScript biết điều này
    return <Alert severity="error" sx={{ m: 3 }}>{state.error}</Alert>;
  }

  // state.status === "success" — state.data là Product[]
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight={800} mb={3}>
        CSC Shop – TypeScript Edition
      </Typography>
      <Grid container spacing={2}>
        {state.data.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ShoppingPage;

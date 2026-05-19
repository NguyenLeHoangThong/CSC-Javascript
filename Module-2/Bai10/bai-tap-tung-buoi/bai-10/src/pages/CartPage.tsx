import { Box, Container, Grid, Typography } from "@mui/material";

import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CardSummary";
import EmptyState from "../components/common/EmptyState";
import BackButton from "../components/common/BackButton";

import { useCart } from "../context/CartProvider";

const CartPage = () => {
  const { cartItems, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return <EmptyState message="Your cart is empty" showBackHome />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Box sx={{ mb: 2.5 }}>
        <BackButton />
      </Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          marginBottom: { xs: 2.5, md: 4 },
        }}
      >
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary totalPrice={totalPrice} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;

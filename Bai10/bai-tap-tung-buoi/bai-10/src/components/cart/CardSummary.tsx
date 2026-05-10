import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import { Link } from "react-router-dom";

const CartSummary = ({ totalPrice }: { totalPrice: number }) => {
  return (
    <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", position: { md: "sticky" }, top: { md: 90 } }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          Order Summary
        </Typography>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Typography>Total</Typography>

          <Typography fontWeight={700}>${totalPrice.toFixed(2)}</Typography>
        </Box>

        <Button component={Link} to="/checkout" fullWidth variant="contained" sx={{ mt: 3 }}>
          Proceed To Checkout
        </Button>
      </CardContent>
    </Card>
  );
};

export default CartSummary;

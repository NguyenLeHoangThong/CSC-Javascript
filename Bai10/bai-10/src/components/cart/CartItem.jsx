import { Box, Button, Card, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { useCart } from "../../context/CartProvider";

const CartItem = ({ item }) => {
  const { dispatch } = useCart();

  return (
    <Card sx={{ display: "flex", mb: 1.8, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <CardMedia component="img" image={item.thumbnail} sx={{ width: { xs: 104, sm: 140 }, objectFit: "contain", p: 1.5 }} />

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Typography fontWeight={700}>{item.title}</Typography>

        <Typography color="secondary" mt={1}>
          ${Number(item.price).toLocaleString()}
        </Typography>

        <Stack direction="row" spacing={1} mt={1.5} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            sx={{ minWidth: 36 }}
            onClick={() =>
              dispatch({
                type: "DECREASE_QUANTITY",
                payload: item.id,
              })
            }
          >
            -
          </Button>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>{item.quantity}</Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            sx={{ minWidth: 36 }}
            onClick={() =>
              dispatch({
                type: "INCREASE_QUANTITY",
                payload: item.id,
              })
            }
          >
            +
          </Button>

          <IconButton
            size="small"
            onClick={() =>
              dispatch({
                type: "REMOVE_FROM_CART",
                payload: item.id,
              })
            }
          >
            <DeleteIcon />
          </IconButton>

          <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
            <Typography fontWeight={700}>${Number(item.price * item.quantity).toFixed(2)}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CartItem;

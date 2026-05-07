import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Box } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type { Product } from "../types/cart";
import { useCart } from "../context/CartContext";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { dispatch } = useCart();

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2, border: "1px solid #eee", boxShadow: "none" }}>
      {/* Khung ảnh cố định */}
      <Box sx={{ height: 220, p: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#fff" }}>
        <CardMedia component="img" image={product.image} sx={{ maxHeight: "100%", maxWidth: "100%", width: "auto", objectFit: "contain" }} />
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight="bold">
          {product.category.toUpperCase()}
        </Typography>

        {/* Tiêu đề ép 2 dòng */}
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{
            mt: 1,
            mb: 2,
            height: "3em",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Typography>

        <Typography variant="h6" color="primary" fontWeight="bold">
          {(product.price || 0).toLocaleString()}đ
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => dispatch({ type: "ADD_ITEM", payload: product })}
          sx={{ py: 1, textTransform: "none", borderRadius: 2 }}
        >
          MUA NGAY
        </Button>
      </CardActions>
    </Card>
  );
};

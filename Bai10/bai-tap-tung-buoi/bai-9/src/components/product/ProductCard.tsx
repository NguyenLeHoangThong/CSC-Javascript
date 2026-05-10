import { Box, Button, Card, CardContent, CardMedia, IconButton, Rating, Snackbar, Typography, Alert, Stack } from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import { Product } from "../../types";

const ProductCard = ({ product }: { product: Product }) => {
  const { dispatch, cartItems, isInWishlist, toggleWishlist } = useCart();

  const isWishlisted = isInWishlist(product.id);
  const itemInCart = cartItems.find((item) => item.id === product.id);
  const currentQuantity = itemInCart?.quantity ?? 0;

  const [toastOpen, setToastOpen] = useState(false);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });
    setToastOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* IMAGE */}
        <Box component={Link} to={`/product/${product.id}`} sx={{ display: "block" }}>
          <CardMedia component="img" image={product.thumbnail} sx={{ height: 200, objectFit: "contain", p: 2 }} />
        </Box>

        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* TITLE */}
          <Typography
            component={Link}
            to={`/product/${product.id}`}
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontWeight: 600,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 48,
            }}
          >
            {product.title}
          </Typography>

          {/* ⭐ RATING (FIX: xuống dòng riêng) */}
          <Stack direction="row" alignItems="center" spacing={1} mt={1}>
            <Rating value={product.rating} precision={0.5} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">
              ({product.ratingCount})
            </Typography>
          </Stack>

          {/* PRICE */}
          <Typography variant="h6" color="secondary.main" fontWeight={800} mt={1}>
            ${Number(product.price).toLocaleString()}
          </Typography>

          {/* ACTIONS */}
          <Box
            sx={{
              mt: "auto",
              display: "flex",
              alignItems: "center",
              pt: 2,
            }}
          >
            <Button variant="contained" size="small" onClick={handleAddToCart}>
              {currentQuantity > 0 ? `In Cart (${currentQuantity})` : "Add To Cart"}
            </Button>

            <IconButton color={isWishlisted ? "error" : "default"} onClick={() => toggleWishlist(product.id)}>
              {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* TOAST */}
      <Snackbar open={toastOpen} autoHideDuration={1500} onClose={() => setToastOpen(false)}>
        <Alert severity="success">Added to cart</Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;

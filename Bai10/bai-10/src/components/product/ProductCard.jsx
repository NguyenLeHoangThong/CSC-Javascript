import { Box, Button, Card, CardContent, CardMedia, IconButton, Rating, Snackbar, Typography, Alert } from "@mui/material";
import { useState } from "react";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Link } from "react-router-dom";

import { useCart } from "../../context/CartProvider";

const ProductCard = ({ product }) => {
  const { dispatch, cartItems, isInWishlist, toggleWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const [toastOpen, setToastOpen] = useState(false);
  const itemInCart = cartItems.find((item) => item.id === product.id);
  const currentQuantity = itemInCart?.quantity ?? 0;

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
          transition: "0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          },
        }}
      >
        <Box component={Link} to={`/product/${product.id}`} sx={{ display: "block", textDecoration: "none" }}>
          <CardMedia component="img" image={product.thumbnail} alt={product.title} sx={{ height: 210, objectFit: "contain", p: 2 }} />
        </Box>
        <CardContent>
          <Typography
            component={Link}
            to={`/product/${product.id}`}
            fontWeight={600}
            sx={{
              color: "text.primary",
              textDecoration: "none",
              display: "-webkit-box",
              overflow: "hidden",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: 48,
            }}
          >
            {product.title}
          </Typography>

          <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ mt: 1 }} />

          <Typography variant="h6" color="secondary.main" fontWeight={800} mt={1}>
            ${Number(product.price).toLocaleString()}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button variant="contained" size="small" onClick={handleAddToCart}>
              {currentQuantity > 0 ? `In Cart: ${currentQuantity}` : "Add To Cart"}
            </Button>

            <IconButton color={isWishlisted ? "error" : "default"} onClick={() => toggleWishlist(product.id)}>
              {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={toastOpen}
        autoHideDuration={1400}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Added to cart successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;

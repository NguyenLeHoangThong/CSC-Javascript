import { Box, Button, Card, CardContent, CardMedia, IconButton, Rating, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { Product } from "../types/cart";
import { useCart } from "../context/CartContext";

// Typed props — TypeScript báo lỗi nếu truyền sai shape
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { dispatch, isInWishlist, toggleWishlist, state } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const itemInCart = state.cartItems.find((item) => item.id === product.id);
  const currentQty = itemInCart?.quantity ?? 0;

  return (
    <Card sx={{ height: "100%", borderRadius: 2, transition: "0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: 4 } }}>
      <CardMedia component="img" image={product.thumbnail} alt={product.title} sx={{ height: 180, objectFit: "contain", p: 2 }} />
      <CardContent>
        <Typography fontWeight={600} sx={{ display: "-webkit-box", overflow: "hidden", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.title}
        </Typography>
        <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ mt: 1 }} />
        <Typography variant="h6" color="secondary" fontWeight={800} mt={1}>
          ${product.price}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Button
            variant="contained"
            size="small"
            onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })}
          >
            {currentQty > 0 ? `In Cart: ${currentQty}` : "Add To Cart"}
          </Button>
          <IconButton color={isWishlisted ? "error" : "default"} onClick={() => toggleWishlist(product.id)}>
            {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

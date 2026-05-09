import { Box, Button, Card, CardContent, CardMedia, IconButton, Rating, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => (
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
        <Button variant="contained" size="small" onClick={() => {}}>
          Add To Cart
        </Button>

        <IconButton color={isFavorite ? "error" : "default"} onClick={() => onToggleFavorite(product.id)}>
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

export default ProductCard;

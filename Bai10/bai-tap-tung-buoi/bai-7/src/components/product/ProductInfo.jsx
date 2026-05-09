import { Box, Button, Rating, Typography } from "@mui/material";

const ProductInfo = ({ product }) => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={2}>
        {product.title}
      </Typography>

      <Rating value={product.rating} precision={0.5} readOnly />

      <Typography variant="h4" color="secondary" fontWeight={700} mt={2}>
        ${Number(product.price).toLocaleString()}
      </Typography>

      <Typography mt={1} color="text.secondary">
        Brand: {product.brand || "N/A"} - Stock: {product.stock ?? 0}
      </Typography>

      <Typography mt={3} color="text.secondary">
        {product.description}
      </Typography>

      <Button variant="contained" size="large" sx={{ mt: 4 }}>
        Add To Cart
      </Button>
    </Box>
  );
};

export default ProductInfo;

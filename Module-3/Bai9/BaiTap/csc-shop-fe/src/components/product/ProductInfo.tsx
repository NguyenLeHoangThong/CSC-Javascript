import { Box, Button, Rating, Typography } from "@mui/material";
import { useCart } from "../../context/CartProvider";
import type { Product } from "../../types/product";

type Props = {
  product: Product;
};

const ProductInfo = ({ product }: Props) => {
  const { dispatch } = useCart();

  return (
    <Box>
      <Typography variant="h4">{product.title}</Typography>

      <Rating value={product.rating} readOnly />

      <Typography variant="h4" color="secondary.main">
        ${product.price.toLocaleString()}
      </Typography>

      <Typography>
        Brand: {product.brand} - Stock: {product.stock}
      </Typography>

      <Typography mt={3}>{product.description}</Typography>

      <Button variant="contained" onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })}>
        Add To Cart
      </Button>
    </Box>
  );
};

export default ProductInfo;

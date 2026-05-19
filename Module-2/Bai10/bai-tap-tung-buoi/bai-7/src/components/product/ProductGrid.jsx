import { Grid } from "@mui/material";

import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;

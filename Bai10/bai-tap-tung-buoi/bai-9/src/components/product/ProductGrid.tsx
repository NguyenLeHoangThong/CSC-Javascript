import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import type { Product } from "../../types/product";

type Props = {
  products: Product[];
};

const ProductGrid = ({ products }: Props) => {
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;

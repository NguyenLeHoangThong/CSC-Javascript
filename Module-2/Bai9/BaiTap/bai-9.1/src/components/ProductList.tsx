import React, { useEffect, useState } from 'react';
import { Grid, Skeleton } from '@mui/material';
import type { Product } from '../types/cart';
import { productService } from '../services/productService';
import { ProductCard } from './ProductCard';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  if (loading) return (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, i) => (
        <Grid item xs={12} sm={6} key={i}><Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} /></Grid>
      ))}
    </Grid>
  );

  return (
    <Grid container spacing={3}>
      {products.map(p => (
        <Grid item xs={12} sm={6} key={p.id}> {/* Ép mọi item chiếm đúng 6/12 cột trên màn hình desktop */}
          <ProductCard product={p} />
        </Grid>
      ))}
    </Grid>
  );
};
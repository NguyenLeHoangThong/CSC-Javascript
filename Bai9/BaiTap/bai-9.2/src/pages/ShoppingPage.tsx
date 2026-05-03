import React from 'react';
import { Container, Grid, Typography, Box, CssBaseline } from '@mui/material';
import { ProductList } from '../components/ProductList';
import { ShoppingCart } from '../components/ShoppingCart';

const ShoppingPage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 6 }}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="900" mb={6} letterSpacing={1}>
          PREMIUM <span style={{ color: '#1976d2' }}>STORE</span>
        </Typography>

        <Grid container spacing={4} alignItems="flex-start">
          {/* CỘT SẢN PHẨM: Luôn chia 2 cột đều nhau trên Desktop */}
          <Grid item xs={12} md={8}>
            <ProductList />
          </Grid>

          {/* CỘT GIỎ HÀNG: Sticky dính màn hình */}
          <Grid item xs={12} md={4} sx={{ position: { md: 'sticky' }, top: 24 }}>
            <Box sx={{ 
              bgcolor: '#fff', 
              borderRadius: 3, 
              border: '1px solid #eee',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <ShoppingCart />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ShoppingPage;
import { Container, Typography, Rating, Button, Stack, Box, Chip, Divider, Paper, Grid } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function ProductDetail() {
  return (
    <Container sx={{ py: { xs: 4, md: 8 } }}>
      {/* MUI v6 dùng Grid container mà không cần prop 'item' ở các cột con.
         Thay vào đó dùng prop 'size'.
      */}
      <Grid container spacing={{ xs: 4, md: 10 }} alignItems="center">
        
        {/* CỘT TRÁI: HÌNH ẢNH - size md=6 là chia đôi màn hình desktop */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: 'action.hover', 
              borderRadius: 4, 
              p: 2, 
              display: 'flex', 
              justifyContent: 'center' 
            }}
          >
            <Box 
              component="img" 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800" 
              alt="Sony Headphone"
              sx={{ 
                width: '100%', 
                maxWidth: 450, 
                height: 'auto', 
                borderRadius: 2,
              }} 
            />
          </Paper>
        </Grid>

        {/* CỘT PHẢI: THÔNG TIN - size md=6 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            <Box>
              <Chip label="Bán chạy" color="error" size="small" sx={{ mb: 1, fontWeight: 'bold' }} />
              <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                Sony WH-1000XM5
              </Typography>
              
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Rating value={4.5} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">(1,250 đánh giá)</Typography>
              </Stack>
            </Box>

            <Typography variant="h4" color="error" fontWeight="bold">
              8.490.000đ
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Công nghệ chống ồn hàng đầu thế giới. Thiết kế tinh tế, thời lượng pin 30 giờ, 
              mang lại trải nghiệm âm thanh hoàn hảo cho cả ngày dài.
            </Typography>

            <Divider />

            <Box>
              <Typography fontWeight="bold" gutterBottom>Màu sắc:</Typography>
              <Stack direction="row" spacing={2}>
                <Chip label="Đen" variant="filled" onClick={() => {}} />
                <Chip label="Bạc" variant="outlined" onClick={() => {}} />
              </Stack>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<AddShoppingCartIcon />} 
                sx={{ flexGrow: 1, py: 1.5, borderRadius: 2 }}
              >
                Thêm vào giỏ
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                sx={{ flexGrow: 1, py: 1.5, borderRadius: 2 }}
              >
                Mua ngay
              </Button>
            </Stack>
          </Stack>
        </Grid>

      </Grid>
    </Container>
  );
}
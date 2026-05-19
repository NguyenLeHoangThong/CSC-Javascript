import { Box, Button, Container, Typography } from "@mui/material";

const HeroBanner = () => (
  <Container sx={{ mt: 4 }}>
    <Box
      sx={{
        background: "linear-gradient(135deg, #0B74E5 0%, #3f8cff 100%)",
        borderRadius: 4,
        p: { xs: 4, md: 8 },
        color: "white",
        backgroundImage: 'url(https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h3" fontWeight={700} mb={2}>
          Fast Shipping, Curated Products
        </Typography>
        <Typography variant="h6" mb={4}>
          A floral-themed, modern shopping experience.
        </Typography>
        <Button variant="contained" color="secondary" size="large">
          Shop Now
        </Button>
      </Box>
      <Box sx={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 180,
        height: 180,
        background: 'radial-gradient(circle, #fff3 60%, transparent 100%)',
        zIndex: 1,
      }} />
    </Box>
  </Container>
);

export default HeroBanner;

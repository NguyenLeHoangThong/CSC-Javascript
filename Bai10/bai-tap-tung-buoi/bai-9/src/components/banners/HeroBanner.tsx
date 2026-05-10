import { Box, Button, Container, Typography } from "@mui/material";

const HeroBanner = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #0B74E5 0%, #3f8cff 100%)",
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight={700} mb={2}>
          Mega Product Sale
        </Typography>

        <Typography variant="h6" mb={4}>
          Best deals for phones, laptops and accessories.
        </Typography>

        <Button variant="contained" color="secondary" size="large">
          Shop Now
        </Button>
      </Box>
    </Container>
  );
};

export default HeroBanner;

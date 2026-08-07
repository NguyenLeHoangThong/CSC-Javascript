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
        {/* Bài 38 — this MUI version no longer accepts system props (fontWeight, mb,
            mt, alignItems…) as bare props; they belong in `sx`. Module 3 built with
            `vite build` (esbuild, no type check) so these never surfaced. */}
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Mega Product Sale
        </Typography>

        <Typography variant="h6" sx={{ mb: 4 }}>
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

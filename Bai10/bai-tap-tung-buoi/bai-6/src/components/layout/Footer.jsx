import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #0B74E5 0%, #4f46e5 100%)",
        color: "white",
        mt: 6,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          left: -40,
          bottom: -80,
        },
      }}
    >
      <Container sx={{ py: 4 }}>
        <Typography textAlign="center">© 2026 CSC Shop. A marketplace demo for React developers.</Typography>
      </Container>
    </Box>
  );
};

export default Footer;

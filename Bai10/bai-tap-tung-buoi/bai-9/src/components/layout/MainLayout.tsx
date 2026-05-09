import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => (
  <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar sx={{ gap: 3 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            fontWeight={800}
            sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}
          >
            CSC Shop – TypeScript
          </Typography>
          <Typography
            component={Link}
            to="/form-demo"
            sx={{ color: "inherit", textDecoration: "none", fontSize: 14 }}
          >
            Form Demo
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>

    <Box sx={{ flex: 1 }}>
      <Outlet />
    </Box>

    <Box sx={{ background: "linear-gradient(90deg, #0B74E5, #4f46e5)", color: "white", py: 2 }}>
      <Container>
        <Typography textAlign="center" fontSize={14}>© 2025 CSC Shop – TypeScript Edition</Typography>
      </Container>
    </Box>
  </Box>
);

export default MainLayout;

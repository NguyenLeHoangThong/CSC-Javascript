import { AppBar, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";

const MainLayout = () => (
  <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            fontWeight={800}
            sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}
          >
            CSC Shop
          </Typography>
          <ThemeToggle />
          <IconButton component={Link} to="/cart" color="inherit">
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>

    <Box sx={{ flex: 1 }}>
      <Outlet />
    </Box>

    <Box sx={{ background: "linear-gradient(90deg, #0B74E5, #4f46e5)", color: "white", py: 3 }}>
      <Container>
        <Typography textAlign="center">© 2025 CSC Shop</Typography>
      </Container>
    </Box>
  </Box>
);

export default MainLayout;

import { AppBar, Badge, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { Link } from "react-router-dom";

import SearchBar from "../common/SearchBar";
import ThemeToggle from "../common/ThemeToggle";
import { useCart } from "../../context/CartProvider";

const Header = ({ search, setSearch }) => {
  const { totalItems } = useCart();

  return (
    <AppBar position="sticky" color="primary" elevation={0} sx={{ borderBottom: "1px solid rgba(255,255,255,0.18)" }}>
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            gap: { xs: 1.2, md: 2.5 },
            py: { xs: 0.8, md: 1 },
            px: "0 !important",
          }}
        >
          <Typography
            component={Link}
            to="/"
            variant="h5"
            fontWeight={800}
            sx={{ color: "inherit", textDecoration: "none", whiteSpace: "nowrap", fontSize: { xs: "1.1rem", md: "1.4rem" } }}
          >
            CSC Shop
          </Typography>

          <Box sx={{ flex: 1 }}>
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
          </Box>

          <ThemeToggle />

          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

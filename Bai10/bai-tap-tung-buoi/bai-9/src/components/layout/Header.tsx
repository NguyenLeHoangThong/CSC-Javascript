import { AppBar, Badge, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

import SearchBar from "../common/SearchBar";
import ThemeToggle from "../common/ThemeToggle";
import { useCart } from "../../context/CartProvider";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const Header = ({ search, setSearch }: Props) => {
  const { totalItems } = useCart();

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* LEFT - LOGO */}
          <Typography
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            <h2>CSC Shop</h2>
          </Typography>

          {/* CENTER - SEARCH */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "100%", maxWidth: 600 }}>
              <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box>
          </Box>

          {/* RIGHT - ACTIONS (FIX HERE) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginLeft: "auto", // 🔥 KEY FIX
            }}
          >
            <ThemeToggle />

            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

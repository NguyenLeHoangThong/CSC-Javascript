import { AppBar, Badge, Box, Button, Container, Divider, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SearchBar from "../common/SearchBar";
import ThemeToggle from "../common/ThemeToggle";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../context/AuthProvider";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const Header = ({ search, setSearch }: Props) => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Anchor element for the account dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate("/");
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* LEFT - LOGO */}
          <Typography component={Link} to="/" sx={{ textDecoration: "none", color: "inherit", fontWeight: 800, whiteSpace: "nowrap" }}>
            <h2>CSC Shop</h2>
          </Typography>

          {/* CENTER - SEARCH */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "100%", maxWidth: 600 }}>
              <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box>
          </Box>

          {/* RIGHT - ACTIONS */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginLeft: "auto" }}>
            <ThemeToggle />

            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <PersonIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
                  <MenuItem disabled>
                    <Typography variant="body2">Hi, {user?.name}</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem component={Link} to="/orders" onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                      <ReceiptLongIcon fontSize="small" />
                    </ListItemIcon>
                    My orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} to="/login" color="inherit" variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.5)" }}>
                Sign in
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

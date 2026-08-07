import { AppBar, Avatar, Badge, Box, Button, Container, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SearchBar from "../common/SearchBar";
import ThemeToggle from "../common/ThemeToggle";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../context/AuthContext";

type Props = { search: string; setSearch: (value: string) => void };

const Header = ({ search, setSearch }: Props) => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate("/");
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography component={Link} to="/" sx={{ textDecoration: "none", color: "inherit", fontWeight: 800, whiteSpace: "nowrap" }}>
            <h2>CSC Shop</h2>
          </Typography>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "100%", maxWidth: 600 }}>
              <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginLeft: "auto" }}>
            <ThemeToggle />
            <IconButton component={Link} to="/cart" color="inherit" aria-label="Giỏ hàng">
              <Badge badgeContent={totalItems} color="secondary"><ShoppingCartIcon /></Badge>
            </IconButton>

            {user ? (
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Tài khoản">
                  <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>{user.name[0].toUpperCase()}</Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
                  <MenuItem disabled><Typography variant="body2">Xin chào, {user.name}</Typography></MenuItem>
                  <Divider />
                  <MenuItem component={Link} to="/my-orders" onClick={() => setAnchorEl(null)}>Đơn hàng của tôi</MenuItem>
                  {user.role === "admin" && (
                    <MenuItem component={Link} to="/admin/products" onClick={() => setAnchorEl(null)}>Quản lý</MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} to="/login" color="inherit" variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.5)" }}>
                Đăng nhập
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

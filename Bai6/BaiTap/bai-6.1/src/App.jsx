import React, { useState } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { 
  ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, 
  Typography, IconButton, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText
} from '@mui/material';
import { Menu as MenuIcon, Dashboard, LocalShipping, Settings, Brightness4, Brightness7 } from '@mui/icons-material';

export default function App() {
  const [mode, setMode] = useState('light'); // useState đơn giản để đổi theme
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tạo theme trực tiếp trong function
  const myTheme = createTheme({
    palette: { mode: mode },
  });

  const menuItems = [
    { text: 'Tổng quan', icon: <Dashboard />, path: '/' },
    { text: 'Đơn hàng', icon: <LocalShipping />, path: '/orders' },
    { text: 'Cài đặt', icon: <Settings />, path: '/settings' },
  ];

  return (
    <ThemeProvider theme={myTheme}>
      <CssBaseline />
      <BrowserRouter>
        {/* AppBar: Thanh công cụ phía trên */}
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>SHIPPER ADMIN</Typography>
            <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Drawer cho Mobile (Chạm vào hiện ra) */}
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Box sx={{ width: 240 }} onClick={() => setMobileOpen(false)}>
            <List sx={{ mt: 8 }}>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton component={Link} to={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Sidebar cho Desktop (Luôn hiện) */}
        <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: 240 } }}>
          <List sx={{ mt: 8 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Vùng nội dung chính */}
        <Box component="main" sx={{ ml: { sm: '240px' }, p: 3, mt: 8 }}>
           <Typography variant="h4">Nội dung quản trị</Typography>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
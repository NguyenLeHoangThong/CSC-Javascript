import { AppBar, Toolbar, Typography, IconButton, Container } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export default function MainLayout({ children, mode, onToggleMode }) {
  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Container>
          <Toolbar disableGutters>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              PARTNER MANAGER
            </Typography>
            <IconButton onClick={onToggleMode} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ mt: 4 }}>{children}</Container>
    </>
  );
}
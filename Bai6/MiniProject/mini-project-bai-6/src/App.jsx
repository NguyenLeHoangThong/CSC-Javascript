import { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createCustomTheme } from './theme';
import MainLayout from './layouts/MainLayout';
import ListPage from './pages/ListPage';
import AddPage from './pages/AddPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  const [mode, setMode] = useState('light');
  
  // Tối ưu hiệu năng: chỉ tạo lại theme khi mode thay đổi
  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Quan trọng: Để đổi màu nền body khi chuyển mode */}
      <BrowserRouter>
        <MainLayout mode={mode} onToggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')}>
          <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/add" element={<AddPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
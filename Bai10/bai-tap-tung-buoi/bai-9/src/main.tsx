import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import router from "./router/index.tsx";
import { CartProvider } from "./context/CartContext";

const theme = createTheme({
  palette: {
    primary: { main: "#0B74E5" },
    secondary: { main: "#FF424E" },
  },
  typography: { fontFamily: "Inter, sans-serif" },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 700 } },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </ThemeProvider>
);

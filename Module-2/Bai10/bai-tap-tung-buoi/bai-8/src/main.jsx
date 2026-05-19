/* eslint-disable react-refresh/only-export-components */
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import router from "./router";
import "./index.css";

import { CartProvider } from "./context/CartProvider";
import { ThemeContextProvider, useThemeContext } from "./theme/theme";

const Providers = () => {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <CartProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={router} />
        </LocalizationProvider>
      </CartProvider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeContextProvider>
    <Providers />
  </ThemeContextProvider>,
);

/* eslint-disable react-refresh/only-export-components */
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(() => {
    let customTheme = createTheme({
      palette: {
        mode,
        primary: { main: "#0B74E5" },
        secondary: { main: "#FF424E" },
        background: {
          default: mode === "light" ? "#f3f6ff" : "#0d1324",
          paper: mode === "light" ? "#ffffff" : "#1a243d",
        },
      },
      typography: { fontFamily: "Inter, sans-serif" },
      shape: { borderRadius: 12 },
      components: {
        MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 700 } } },
      },
    });
    customTheme = responsiveFontSizes(customTheme);
    return customTheme;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

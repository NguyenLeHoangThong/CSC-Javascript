/* eslint-disable react-refresh/only-export-components */
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { createContext, useContext, useMemo, useState, useEffect } from "react";

import type { PaletteMode, Theme } from "@mui/material/styles";

type ThemeContextType = {
  mode: "light" | "dark";
  toggleTheme: () => void;
  theme: Theme;
};

const THEME_KEY = "csc-shop-theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  // ✅ HYDRATE FROM LOCALSTORAGE
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);

    if (saved === "light" || saved === "dark") {
      setMode(saved);
    }
  }, []);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ✅ SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  const theme = useMemo(() => {
    let customTheme = createTheme({
      palette: {
        mode,
        primary: {
          main: "#0B74E5",
        },
        secondary: {
          main: "#FF424E",
        },
        background: {
          default: mode === "light" ? "#f3f6ff" : "#0d1324",
          paper: mode === "light" ? "#ffffff" : "#1a243d",
        },
      },
      typography: {
        fontFamily: "Inter, sans-serif",
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              backdropFilter: "blur(1px)",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 700,
            },
          },
        },
      },
    });

    customTheme = responsiveFontSizes(customTheme);

    return customTheme;
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used inside ThemeContextProvider");
  }

  return context;
};

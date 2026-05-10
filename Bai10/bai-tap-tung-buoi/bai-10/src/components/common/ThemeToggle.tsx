import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useThemeContext } from "../../theme/theme";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <IconButton color="inherit" onClick={toggleTheme}>
      {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ThemeToggle;

import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useThemeContext } from "../../theme/theme";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    // Nút chỉ có icon thì BẮT BUỘC phải có aria-label, nếu không screen reader chỉ
    // đọc được "button" và không ai biết nó làm gì.
    <IconButton
      color="inherit"
      onClick={toggleTheme}
      aria-label={mode === "light" ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}
    >
      {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ThemeToggle;

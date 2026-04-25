import { createTheme } from "@mui/material/styles";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;

  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

// Hàm tạo theme linh hoạt theo mode
export const createCustomTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? { primary: { main: "#1976d2" }, background: { default: "#f4f6f8" } }
        : { primary: { main: "#90caf9" }, background: { default: "#121212" } }),
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehavior, // LinkBehavior đã định nghĩa ở phần trước
        },
      },
    },
  });

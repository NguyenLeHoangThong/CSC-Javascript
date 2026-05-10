import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet

import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  const [search, setSearch] = useState("");

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.45,
          background:
            "radial-gradient(circle at 12% 18%, rgba(255, 122, 162, 0.22) 0, rgba(255,122,162,0) 18%), radial-gradient(circle at 84% 14%, rgba(94, 53, 177, 0.18) 0, rgba(94,53,177,0) 20%), radial-gradient(circle at 78% 82%, rgba(11, 116, 229, 0.16) 0, rgba(11,116,229,0) 16%), radial-gradient(circle at 15% 88%, rgba(89, 219, 170, 0.18) 0, rgba(89,219,170,0) 16%)",
        }}
      />
      <Header search={search} setSearch={setSearch} />

      <Box sx={{ flex: 1, position: "relative", zIndex: 1 }}>
        <Outlet context={{ search }} />
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EmptyState = ({ message, showBackHome = false }) => {
  const navigate = useNavigate();

  return (
    <Paper variant="outlined" sx={{ py: 6, px: 2.5, textAlign: "center", borderRadius: 3 }}>
      <Box sx={{ mb: 1.5 }}>
        <SearchOffIcon color="disabled" sx={{ fontSize: 44 }} />
      </Box>
      <Typography color="text.secondary">{message}</Typography>
      {showBackHome ? (
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/")}>
          Back to home
        </Button>
      ) : null}
    </Paper>
  );
};

export default EmptyState;

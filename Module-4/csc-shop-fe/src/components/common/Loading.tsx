import { Box, LinearProgress, Typography } from "@mui/material";

const Loading = ({ message = "Loading..." }) => {
  return (
    <Box sx={{ py: 2 }}>
      <LinearProgress sx={{ borderRadius: 1.5, height: 6 }} />
      <Typography sx={{ color: "text.secondary", mt: 1.2, fontSize: 14 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;

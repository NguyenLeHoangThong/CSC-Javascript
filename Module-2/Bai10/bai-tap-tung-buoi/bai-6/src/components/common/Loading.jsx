import { Box, LinearProgress, Typography } from "@mui/material";

const Loading = ({ message = "Loading..." }) => (
  <Box py={2}>
    <LinearProgress sx={{ borderRadius: 1.5, height: 6 }} />
    <Typography color="text.secondary" mt={1.2} fontSize={14}>
      {message}
    </Typography>
  </Box>
);

export default Loading;

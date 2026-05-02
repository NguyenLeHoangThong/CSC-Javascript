import React, { useContext, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { SurveyContext } from "../contexts/SurveyContext";

const Review = ({ back }) => {
  const { formData } = useContext(SurveyContext);

  const formatted = useMemo(() => {
    return {
      ...formData,
      hobbies: formData.hobbies.join(", "),
      agree: formData.agree ? "Yes" : "No",
    };
  }, [formData]);

  return (
    <Box>
      <Typography variant="h6">Review</Typography>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1}>
        <Typography>Name: {formatted.name}</Typography>
        <Typography>Email: {formatted.email}</Typography>
        <Typography>Age: {formatted.age}</Typography>
        <Typography>Hobbies: {formatted.hobbies}</Typography>
        <Typography>Color: {formatted.color}</Typography>
        <Typography>Agree: {formatted.agree}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
        <Button onClick={back}>Back</Button>
        <Button variant="contained" color="success">
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default Review;
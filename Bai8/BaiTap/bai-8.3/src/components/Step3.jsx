import React, { useContext } from "react";
import {
  Box,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { SurveyContext } from "../contexts/SurveyContext";

const Step3 = ({ next, back }) => {
  const { formData, updateData } = useContext(SurveyContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    if (!data.agree) return;
    updateData(data);
    next();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <FormControlLabel
          control={<Checkbox {...register("agree", { required: true })} />}
          label="I agree to terms"
        />

        {errors.agree && (
          <FormHelperText error>You must agree</FormHelperText>
        )}

        <Stack direction="row" justifyContent="space-between">
          <Button onClick={back}>Back</Button>
          <Button variant="contained" type="submit">
            Finish
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Step3;
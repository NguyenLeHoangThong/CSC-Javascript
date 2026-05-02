import React, { useContext } from "react";
import { Box, Button, TextField, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { SurveyContext } from "../contexts/SurveyContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  age: yup.number().typeError("Must be number").positive().required(),
});

const Step1 = ({ next }) => {
  const { formData, updateData } = useContext(SurveyContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    updateData(data);
    next();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField
          label="Name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Age"
          {...register("age")}
          error={!!errors.age}
          helperText={errors.age?.message}
        />

        <Button variant="contained" type="submit">
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default Step1;
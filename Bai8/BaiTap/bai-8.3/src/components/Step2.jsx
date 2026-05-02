import React, { useContext } from "react";
import {
  Box,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { SurveyContext } from "../contexts/SurveyContext";

const Step2 = ({ next, back }) => {
  const { formData, updateData } = useContext(SurveyContext);

  const { control, handleSubmit } = useForm({
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateData(data);
    next();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {/* HOBBIES */}
        <Controller
          name="hobbies"
          control={control}
          render={({ field }) => {
            const { value = [], onChange } = field;

            const handleCheck = (val) => {
              if (value.includes(val)) {
                onChange(value.filter((v) => v !== val));
              } else {
                onChange([...value, val]);
              }
            };

            return (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value.includes("sports")}
                      onChange={() => handleCheck("sports")}
                    />
                  }
                  label="Sports"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value.includes("music")}
                      onChange={() => handleCheck("music")}
                    />
                  }
                  label="Music"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value.includes("coding")}
                      onChange={() => handleCheck("coding")}
                    />
                  }
                  label="Coding"
                />
              </>
            );
          }}
        />

        {/* COLOR */}
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Favorite Color</InputLabel>
              <Select {...field} label="Favorite Color">
                <MenuItem value="red">Red</MenuItem>
                <MenuItem value="blue">Blue</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Stack direction="row" justifyContent="space-between">
          <Button onClick={back}>Back</Button>
          <Button variant="contained" type="submit">
            Next
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Step2;
import React from "react";
import { Box, TextField, MenuItem, Button, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import type { EmployeeFormInput } from "../types/employee";

interface Props {
  onAddSuccess: (data: EmployeeFormInput) => void;
}

const EmployeeForm: React.FC<Props> = ({ onAddSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormInput>();

  return (
    <Box component="form" onSubmit={handleSubmit(onAddSuccess)} sx={{ mb: 4, p: 3, bgcolor: "#f9f9f9", borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>
        Thêm nhân viên
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField label="Họ tên" fullWidth {...register("fullName", { required: "Bắt buộc" })} error={!!errors.fullName} />
        <TextField label="Email" fullWidth {...register("email", { required: "Bắt buộc" })} error={!!errors.email} />
        <TextField select label="Trạng thái" defaultValue="Active" fullWidth {...register("status")}>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
          <MenuItem value="On Leave">On Leave</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" sx={{ px: 4 }}>
          Thêm
        </Button>
      </Stack>
    </Box>
  );
};

export default EmployeeForm;

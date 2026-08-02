import { Alert, Box, Button, Container, Link as MuiLink, Paper, TextField, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

import { useAuth } from "../context/AuthProvider";
import type { RegisterPayload } from "../types/auth";

// Mirror the backend's registerSchema so the user gets instant client-side feedback.
const schema = yup.object({
  name: yup.string().trim().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: yup.string().trim().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Need at least 1 uppercase letter")
    .matches(/[0-9]/, "Need at least 1 number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      setError("");
      await registerUser(data);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Create account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Full name" margin="normal" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
          <TextField fullWidth label="Email" margin="normal" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth label="Password" type="password" margin="normal" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
          <TextField fullWidth label="Confirm password" type="password" margin="normal" {...register("confirmPassword")} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3 }} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </Box>

        <Typography sx={{ mt: 3 }} textAlign="center">
          Already have an account?{" "}
          <MuiLink component={Link} to="/login">
            Sign in
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;

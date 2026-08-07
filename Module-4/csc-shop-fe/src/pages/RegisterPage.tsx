import { Alert, Box, Button, Container, Link as MuiLink, Paper, TextField, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import { registerSchema, type RegisterFormData } from "../schemas/authSchema";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setSubmitError("");
      // Backend register expects name/email/password; then auto-login for a smooth UX.
      await authApi.register({ name: data.name, email: data.email, password: data.password });
      await login(data.email, data.password);
      navigate("/");
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message ?? "Đăng ký thất bại.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }} variant="outlined">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Đăng ký</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Họ tên" sx={{ mb: 2 }} {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
          <TextField fullWidth label="Email" sx={{ mb: 2 }} {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth label="Mật khẩu" type="password" sx={{ mb: 2 }} {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
          <TextField fullWidth label="Xác nhận mật khẩu" type="password" sx={{ mb: 2 }} {...register("confirmPassword")} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
          {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Đăng ký"}
          </Button>
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Đã có tài khoản? <MuiLink component={Link} to="/login">Đăng nhập</MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;

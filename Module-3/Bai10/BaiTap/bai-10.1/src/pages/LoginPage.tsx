import { Alert, Box, Button, Container, Link as MuiLink, Paper, TextField, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { loginSchema, type LoginFormData } from "../schemas/authSchema";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitting(true);
      setSubmitError("");
      await login(data.email, data.password);
      navigate("/");
    } catch {
      setSubmitError("Email hoặc mật khẩu không đúng.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }} variant="outlined">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Đăng nhập</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Email" sx={{ mb: 2 }} {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth label="Mật khẩu" type="password" sx={{ mb: 2 }} {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
          {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
          <Button type="submit" variant="contained" fullWidth disabled={submitting}>
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Chưa có tài khoản? <MuiLink component={Link} to="/register">Đăng ký</MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;

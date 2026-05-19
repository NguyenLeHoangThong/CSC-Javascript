import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // 1. Import hook
export default function Login() {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate(); // 2. Khởi tạo hàm điều hướng
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      await login(data.email, data.password);

      // 3. Đăng nhập thành công, điều hướng về trang chủ/dashboard
      // replace: true để người dùng không thể nhấn "Back" quay lại trang Login sau khi đã vào Dashboard
      navigate("/", { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h5" align="center" gutterBottom>
          ĐĂNG NHẬP HỆ THỐNG
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register("email", { required: "Email là bắt buộc" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            margin="normal"
            {...register("password", { required: "Mật khẩu là bắt buộc" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button fullWidth variant="contained" size="large" type="submit" sx={{ mt: 3 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

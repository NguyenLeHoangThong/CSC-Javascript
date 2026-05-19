import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Paper, Typography, Container, Stack } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// 1. Định nghĩa bộ quy tắc Validate (Schema)
const schema = yup.object({
  name: yup
    .string()
    .required("Tên công ty không được để trống")
    .min(3, "Tên phải có ít nhất 3 ký tự"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không đúng định dạng"),
}).required();

export default function AddPage() {
  // 2. Kết nối Yup với React Hook Form qua resolver
  const { control, handleSubmit } = useForm({
    defaultValues: { name: "", email: "" },
    resolver: yupResolver(schema), // "Gắn não" cho Form
  });

  const onSubmit = (data) => {
    console.log("Dữ liệu hợp lệ:", data);
    alert("Thêm đối tác thành công!");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">
          Đăng ký đối tác mới
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            
            {/* Field Tên công ty */}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField 
                  {...field} 
                  label="Tên công ty" 
                  fullWidth 
                  // Nếu có lỗi (error không undefined) thì bật màu đỏ
                  error={!!error} 
                  // Hiển thị tin nhắn lỗi dưới ô input
                  helperText={error?.message} 
                />
              )}
            />

            {/* Field Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField 
                  {...field} 
                  label="Email liên hệ" 
                  fullWidth 
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" href="/" fullWidth>
                Hủy
              </Button>
              <Button type="submit" variant="contained" fullWidth color="primary">
                Lưu lại
              </Button>
            </Stack>

          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
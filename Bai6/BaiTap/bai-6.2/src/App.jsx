import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Danh sách kỹ năng mẫu
const skillOptions = ["React", "Node.js", "Python", "UI/UX Design", "DevOps", "TypeScript"];

// Định nghĩa quy tắc kiểm tra dữ liệu
const talentSchema = yup
  .object({
    fullName: yup.string().required("Vui lòng nhập họ tên"),
    skills: yup.array().min(1, "Chọn ít nhất 1 kỹ năng"),
    startDate: yup.date().nullable().required("Vui lòng chọn ngày đi làm").typeError("Ngày không hợp lệ"),
    agree: yup.boolean().oneOf([true], "Bạn phải đồng ý với điều khoản"),
  })
  .required();

export default function TalentForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(talentSchema),
    defaultValues: { fullName: "", skills: [], startDate: null, agree: false },
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Dữ liệu ứng viên:", data);
    alert("Hồ sơ đã được gửi đi thành công!");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, boxShadow: 8 }}>
          <Typography variant="h4" fontWeight={800} mb={4} textAlign="center">
            HỒ SƠ ỨNG VIÊN
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Họ tên - Full width */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField {...field} label="Họ và tên" fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              </Grid>

              {/* Kỹ năng - Autocomplete (Khó) */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      options={skillOptions}
                      {...field}
                      onChange={(_, data) => field.onChange(data)} // Quan trọng: Cập nhật mảng vào RHF
                      renderInput={(params) => <TextField {...params} label="Kỹ năng chuyên môn" error={!!error} helperText={error?.message} />}
                    />
                  )}
                />
              </Grid>

              {/* Ngày đi làm - DatePicker (Khó) */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Ngày có thể bắt đầu"
                      sx={{ width: "100%" }}
                      slotProps={{
                        textField: {
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Điều khoản - Checkbox */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="agree"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Tôi cam kết các thông tin trên là chính xác" />
                      {error && <FormHelperText error>{error.message}</FormHelperText>}
                    </Box>
                  )}
                />
              </Grid>

              {/* Nút gửi */}
              <Grid size={{ xs: 12 }}>
                <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} sx={{ py: 2, fontWeight: "bold" }}>
                  {isSubmitting ? <CircularProgress size={24} /> : "Nộp hồ sơ ứng tuyển"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}

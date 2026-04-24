import * as yup from "yup";
export const corpSchema = yup.object({
  email: yup.string().email("Email doanh nghiệp không hợp lệ").required("Bắt buộc nhập"),
  website: yup.string().url("Vui lòng nhập đúng định dạng URL (https://...)").required("Nhập website công ty"),
  password: yup
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .matches(/[a-zA-Z]/, "Cần ít nhất 1 chữ cái")
    .matches(/[0-9]/, "Cần ít nhất 1 con số")
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không trùng khớp")
    .required("Vui lòng xác nhận lại"),
  agree: yup.boolean().oneOf([true], "Bạn phải đồng ý với điều khoản dịch vụ"),
});

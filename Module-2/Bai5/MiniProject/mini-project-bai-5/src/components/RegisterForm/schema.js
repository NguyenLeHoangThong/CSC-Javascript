import * as yup from "yup";

export const registerSchema = yup.object({
  fullName: yup.string().required("Họ tên không được để trống"),
  email: yup
    .string()
    .email("Email không đúng định dạng")
    .required("Bắt buộc nhập Email"),
  password: yup
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .required("Mật khẩu là bắt buộc"),
  note: yup.string().max(50, "Ghi chú không được vượt quá 50 ký tự")
});
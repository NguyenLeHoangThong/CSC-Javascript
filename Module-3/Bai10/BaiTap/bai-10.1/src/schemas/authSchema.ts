import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().trim().email("Email không hợp lệ").required("Bắt buộc nhập email"),
  password: yup.string().required("Bắt buộc nhập mật khẩu"),
});

export const registerSchema = yup.object({
  name: yup.string().trim().min(2, "Tên tối thiểu 2 ký tự").required("Bắt buộc nhập tên"),
  email: yup.string().trim().email("Email không hợp lệ").required("Bắt buộc nhập email"),
  password: yup
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .matches(/[A-Z]/, "Cần ít nhất 1 chữ hoa")
    .matches(/[0-9]/, "Cần ít nhất 1 số")
    .required("Bắt buộc nhập mật khẩu"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Bắt buộc xác nhận mật khẩu"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;

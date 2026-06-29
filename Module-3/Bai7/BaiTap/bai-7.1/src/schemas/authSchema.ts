import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string().min(2, 'Tên tối thiểu 2 ký tự').max(100).required(),
  email: yup.string().email('Email không hợp lệ').max(150).required(),
  password: yup
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .matches(/[A-Z]/, 'Cần ít nhất 1 chữ hoa')
    .matches(/[0-9]/, 'Cần ít nhất 1 số')
    .required(),
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

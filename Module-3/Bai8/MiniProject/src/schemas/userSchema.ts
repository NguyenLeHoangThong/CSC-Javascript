import * as yup from 'yup';

// ============================================
// User Schemas (Authorization — Bài 8)
// ============================================

// Update profile — chính chủ hoặc admin. Chỉ cho sửa name, email.
export const updateProfileSchema = yup.object().shape({
  name: yup.string().min(2, 'Tên tối thiểu 2 ký tự').max(100),
  email: yup.string().email('Email không hợp lệ').max(150),
});

// Update role — chỉ admin. Role phải hợp lệ.
export const updateRoleSchema = yup.object().shape({
  role: yup
    .string()
    .required('Role là bắt buộc')
    .oneOf(['user', 'admin'], 'Role chỉ có thể là user hoặc admin'),
});

// Query danh sách user — chỉ admin.
export const userQuerySchema = yup.object().shape({
  role: yup.string().nullable().oneOf(['user', 'admin']),
  search: yup.string().nullable().max(100),
  page: yup.number().positive('page phải lớn hơn 0').default(1),
  limit: yup.number().positive('limit phải lớn hơn 0').max(100).default(10),
});

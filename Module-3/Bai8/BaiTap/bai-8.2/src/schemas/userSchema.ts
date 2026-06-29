import * as yup from 'yup';

// Update profile (self or admin): only name + email allowed.
export const updateProfileSchema = yup.object({
  name: yup.string().min(2).max(100),
  email: yup.string().email().max(150),
});

// Change role (admin only).
export const updateRoleSchema = yup.object({
  role: yup.string().oneOf(['user', 'admin'], 'Role chỉ có thể là user hoặc admin').required(),
});

export const userQuerySchema = yup.object({
  role: yup.string().oneOf(['user', 'admin']).optional(),
  search: yup.string().max(100).optional(),
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
});

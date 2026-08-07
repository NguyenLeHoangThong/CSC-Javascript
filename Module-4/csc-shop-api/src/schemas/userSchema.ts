import * as yup from 'yup';

// Bài 36 — admin user management input validation.

export const userQuerySchema = yup.object().shape({
  search: yup.string().nullable().max(100),
  // Only the two roles the Prisma enum knows about — anything else is a 400,
  // not a database error.
  role: yup.string().nullable().oneOf(['customer', 'admin', null], 'Invalid role'),
  page: yup.number().positive('page must be > 0').default(1),
  limit: yup.number().positive('limit must be > 0').max(100).default(20),
});

export const userRoleSchema = yup.object().shape({
  role: yup.string().required('Role is required').oneOf(['customer', 'admin'], 'Invalid role'),
});

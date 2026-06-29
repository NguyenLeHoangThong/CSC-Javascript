import * as yup from 'yup';

export const createCourseSchema = yup.object({
  title: yup.string().min(2).max(200).required(),
  description: yup.string().nullable(),
  price: yup.number().min(0).required(),
  duration: yup.number().integer().positive('duration (phút) phải > 0').required(),
  categoryId: yup.number().integer().positive().required(),
  status: yup.string().oneOf(['draft', 'published', 'archived']).default('draft'),
});

export const updateCourseSchema = createCourseSchema.partial();

export const courseQuerySchema = yup.object({
  categoryId: yup.number().integer().positive().optional(),
  status: yup.string().oneOf(['draft', 'published', 'archived']).optional(),
  search: yup.string().max(100).optional(),
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
});

export const enrollSchema = yup.object({
  studentName: yup.string().min(2).max(100).required(),
  studentEmail: yup.string().email().max(150).required(),
});

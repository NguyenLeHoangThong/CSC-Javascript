import * as yup from 'yup';

// Create body matches what the React admin form sends: it picks a category by slug.
export const createProductSchema = yup.object({
  title: yup.string().min(1, 'Tên không được rỗng').max(200).required(),
  price: yup.number().positive('Giá phải lớn hơn 0').required(),
  thumbnail: yup.string().url('Thumbnail phải là URL').required(),
  category: yup.string().required('category (slug) là bắt buộc'),
  stock: yup.number().integer().min(0, 'Stock không được âm').default(0),
  brand: yup.string().nullable(),
  description: yup.string().nullable(),
});

export const updateProductSchema = yup.object({
  title: yup.string().min(1).max(200),
  price: yup.number().positive(),
  thumbnail: yup.string().url(),
  category: yup.string(),
  stock: yup.number().integer().min(0),
  brand: yup.string().nullable(),
  description: yup.string().nullable(),
});

export const productQuerySchema = yup.object({
  category: yup.string().optional(), // category slug
  search: yup.string().max(100).optional(),
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(12),
});

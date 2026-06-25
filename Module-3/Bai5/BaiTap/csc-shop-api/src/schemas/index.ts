import * as yup from 'yup';

// ============================================
// Category schemas
// ============================================
export const categoryCreateSchema = yup.object().shape({
  name: yup.string().required('Category name is required').min(2).max(100),
  description: yup.string().nullable().max(255),
});

export const categoryUpdateSchema = yup.object().shape({
  name: yup.string().min(2).max(100),
  description: yup.string().nullable().max(255),
});

// ============================================
// Product schemas
// ============================================
export const productCreateSchema = yup.object().shape({
  title: yup.string().required('Title is required').min(2).max(200),
  description: yup.string().required('Description is required').min(5),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be greater than 0')
    .typeError('Price must be a number'),
  thumbnail: yup.string().required('Thumbnail URL is required').max(500),
  brand: yup.string().nullable().max(100),
  stock: yup.number().min(0).integer().default(0).typeError('Stock must be a number'),
  rating: yup.number().min(0).max(5).default(0),
  ratingCount: yup.number().min(0).integer().default(0),
  categoryId: yup
    .number()
    .required('categoryId is required')
    .positive()
    .typeError('categoryId must be a number'),
});

// All fields optional for PATCH (partial update)
export const productUpdateSchema = yup.object().shape({
  title: yup.string().min(2).max(200),
  description: yup.string().min(5),
  price: yup.number().positive('Price must be greater than 0'),
  thumbnail: yup.string().max(500),
  brand: yup.string().nullable().max(100),
  stock: yup.number().min(0).integer(),
  rating: yup.number().min(0).max(5),
  ratingCount: yup.number().min(0).integer(),
  categoryId: yup.number().positive(),
});

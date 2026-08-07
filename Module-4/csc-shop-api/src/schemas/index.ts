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
  price: yup.number().required('Price is required').positive('Price must be greater than 0').typeError('Price must be a number'),
  thumbnail: yup.string().required('Thumbnail URL is required').max(500),
  brand: yup.string().nullable().max(100),
  stock: yup.number().min(0).integer().default(0).typeError('Stock must be a number'),
  rating: yup.number().min(0).max(5).default(0),
  ratingCount: yup.number().min(0).integer().default(0),
  categoryId: yup.number().required('categoryId is required').positive().typeError('categoryId must be a number'),
});

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

// Query string for GET /products — cast strings to numbers and apply safe defaults.
export const productQuerySchema = yup.object().shape({
  search: yup.string().nullable().max(100),
  category: yup.string().nullable().max(100),
  minPrice: yup.number().nullable().min(0).typeError('minPrice must be a number'),
  maxPrice: yup.number().nullable().min(0).typeError('maxPrice must be a number'),
  sortBy: yup.string().nullable().oneOf(['price', 'rating', 'createdAt']).default('createdAt'),
  order: yup.string().nullable().oneOf(['asc', 'desc']).default('desc'),
  page: yup.number().positive('page must be > 0').default(1),
  limit: yup.number().positive('limit must be > 0').max(100).default(12),
});

// ============================================
// Order schemas
// ============================================

// The single list of valid statuses, mirroring the Prisma `OrderStatus` enum.
// Both orderStatusSchema and orderQuerySchema read from it, so adding a status
// means editing one line instead of hunting for duplicated string arrays.
export const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'completed', 'cancelled'] as const;
export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export const orderItemSchema = yup.object().shape({
  productId: yup.number().required('productId is required').positive().integer(),
  quantity: yup.number().required('quantity is required').positive().integer(),
});

export const orderCreateSchema = yup.object().shape({
  customerName: yup.string().required('Customer name is required').min(2).max(100),
  email: yup.string().required('Email is required').email('Invalid email').max(150),
  phone: yup.string().required('Phone is required').max(20),
  address: yup.string().required('Address is required').min(5).max(255),
  provinceCode: yup.string().nullable().max(20),
  wardCode: yup.string().nullable().max(20),
  note: yup.string().nullable().max(300),
  deliveryDate: yup.string().nullable(),
  items: yup.array().of(orderItemSchema).min(1, 'Order must have at least 1 item').required(),
});

export const orderStatusSchema = yup.object().shape({
  status: yup
    .string()
    .required('Status is required')
    .oneOf(ORDER_STATUSES, 'Invalid status'),
});

// Bài 31 — GET /orders had NO query validation in Module 3: `page`/`limit` arrived as
// `undefined`, so buildSkip() computed NaN and buildMeta() returned NaN pages.
// Same schema shape as productQuerySchema — one convention for every list endpoint.
export const orderQuerySchema = yup.object().shape({
  status: yup.string().nullable().oneOf([...ORDER_STATUSES, null], 'Invalid status'),
  page: yup.number().positive('page must be > 0').default(1),
  limit: yup.number().positive('limit must be > 0').max(100).default(20),
});

import * as yup from 'yup';

// Bài 35 — validation for ProductReview.
// Rating is the only required field: a star rating without words is still useful.
export const reviewCreateSchema = yup.object().shape({
  rating: yup
    .number()
    .required('Rating is required')
    .integer('Rating must be a whole number')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .typeError('Rating must be a number'),
  comment: yup.string().nullable().max(500, 'Comment must be at most 500 characters'),
});

// Admin-only moderation: hide/show a review.
export const reviewVisibilitySchema = yup.object().shape({
  isVisible: yup.boolean().required('isVisible is required'),
});

// GET /products/:id/reviews — paginated like every other list endpoint.
export const reviewQuerySchema = yup.object().shape({
  page: yup.number().positive('page must be > 0').default(1),
  limit: yup.number().positive('limit must be > 0').max(50).default(10),
});

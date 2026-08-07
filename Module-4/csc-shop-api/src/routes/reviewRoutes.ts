import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { authorizeOwner } from '../middleware/authorizeOwner';
import { reviewCreateSchema, reviewQuerySchema, reviewVisibilitySchema } from '../schemas/reviewSchema';
import * as controller from '../controllers/reviewController';
import { findOwnerId } from '../services/reviewService';

// Bài 35 — mounted at /api/v1, so the full paths are:
//   GET    /api/v1/products/:id/reviews
//   POST   /api/v1/products/:id/reviews
//   DELETE /api/v1/reviews/:id
//   PATCH  /api/v1/reviews/:id/visibility
const router = Router();

// ── Public read ──
router.get(
  '/products/:id/reviews',
  validateId,
  validateQuery(reviewQuerySchema),
  controller.getProductReviews
);

// ── Logged-in customers ──
router.post(
  '/products/:id/reviews',
  authenticate,
  validateId,
  validate(reviewCreateSchema),
  controller.createReview
);

// Bài 36 — a review is private property: only its author (or an admin) may delete it.
router.delete(
  '/reviews/:id',
  authenticate,
  validateId,
  authorizeOwner(async (req) => findOwnerId(Number(req.params.id))),
  controller.deleteReview
);

// ── Admin moderation ──
router.patch(
  '/reviews/:id/visibility',
  authenticate,
  authorize('admin'),
  validateId,
  validate(reviewVisibilitySchema),
  controller.updateReviewVisibility
);

export default router;

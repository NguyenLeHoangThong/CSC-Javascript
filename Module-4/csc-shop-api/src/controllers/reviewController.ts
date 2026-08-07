import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/reviewService';
import { buildMeta } from '../utils/pagination';
import { ReviewQuery } from '../services/reviewService';
import { AppError } from '../types/api';

export async function getProductReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as ReviewQuery;
    const { data, total, averageRating } = await svc.findByProduct(res.locals.id, query);
    res.json({
      success: true,
      data,
      averageRating,
      meta: buildMeta(total, query.page, query.limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    // req.user is guaranteed: the route runs `authenticate` first.
    const review = await svc.create(res.locals.id, req.user!.id, req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    // @@unique([userId, productId]) fires P2002. The generic handler would answer
    // "user_id already exists", which means nothing to a shopper — translate it here,
    // where we know what the constraint is actually about.
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
      return next(new AppError(409, 'You have already reviewed this product'));
    }
    next(err);
  }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
}

export async function updateReviewVisibility(req: Request, res: Response, next: NextFunction) {
  try {
    const review = await svc.setVisibility(res.locals.id, req.body.isVisible);
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
}

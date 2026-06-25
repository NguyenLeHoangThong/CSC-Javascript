import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import {
  classCreateSchema,
  classQuerySchema,
} from '../schemas/index';
import * as controller from '../controllers/classController';

const router = Router();

router.get(
  '/',
  validateQuery(classQuerySchema),
  controller.getClasses
);

router.get(
  '/:id',
  validateId,
  controller.getClassDetail
);

router.post(
  '/',
  validate(classCreateSchema),
  controller.createClass
);

router.patch(
  '/:id',
  validateId,
  controller.updateClass
);

router.delete(
  '/:id',
  validateId,
  controller.deleteClass
);

router.post(
  '/:id/transfer-student',
  validateId,
  controller.transferStudent
);

export default router;

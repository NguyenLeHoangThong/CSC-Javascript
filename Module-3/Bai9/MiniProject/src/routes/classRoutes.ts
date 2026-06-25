import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import {
  classCreateSchema,
  classQuerySchema,
} from '../schemas/index';
import * as controller from '../controllers/classController';

const router = Router();

// authenticate + authorize('admin') — chỉ admin mới được thay đổi dữ liệu
const adminOnly = [authenticate, authorize('admin')];

// ── Public: đọc dữ liệu không cần token ──
router.get(
  '/',
  validateQuery(classQuerySchema),
  controller.getClasses
);

router.get('/:id', validateId, controller.getClassDetail);

// ── Admin-only: tạo / sửa / xóa lớp + chuyển học sinh ──
router.post('/', ...adminOnly, validate(classCreateSchema), controller.createClass);

router.patch('/:id', ...adminOnly, validateId, controller.updateClass);

router.delete('/:id', ...adminOnly, validateId, controller.deleteClass);

router.post(
  '/:id/transfer-student',
  ...adminOnly,
  validateId,
  controller.transferStudent
);

export default router;

import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import {
  studentCreateSchema,
  studentUpdateSchema,
  studentQuerySchema,
  gradeCreateSchema,
  gradeUpdateSchema,
} from '../schemas/index';
import * as studentController from '../controllers/studentController';
import * as gradeController from '../controllers/gradeController';

const router = Router();

// authenticate + authorize('admin') — chỉ admin mới được thay đổi dữ liệu
const adminOnly = [authenticate, authorize('admin')];

// ── Public: đọc dữ liệu không cần token ──
router.get(
  '/',
  validateQuery(studentQuerySchema),
  studentController.getStudents
);

router.get('/:id', validateId, studentController.getStudentDetail);

router.get('/:id/grades', validateId, gradeController.getStudentGrades);

// ── Admin-only: tạo / sửa / xóa học sinh ──
router.post(
  '/',
  ...adminOnly,
  validate(studentCreateSchema),
  studentController.createStudent
);

router.patch(
  '/:id',
  ...adminOnly,
  validateId,
  validate(studentUpdateSchema),
  studentController.updateStudent
);

router.delete('/:id', ...adminOnly, validateId, studentController.deleteStudent);

// ── Grade sub-routes: chỉ admin được ghi điểm ──
router.post(
  '/:id/grades',
  ...adminOnly,
  validateId,
  validate(gradeCreateSchema),
  gradeController.addGrade
);

router.patch(
  '/:id/grades/:gradeId',
  ...adminOnly,
  validateId,
  validate(gradeUpdateSchema),
  gradeController.updateGrade
);

router.delete(
  '/:id/grades/:gradeId',
  ...adminOnly,
  validateId,
  gradeController.deleteGrade
);

export default router;

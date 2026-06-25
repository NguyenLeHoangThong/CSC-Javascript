import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
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

// ── Public: đọc dữ liệu không cần đăng nhập ──
router.get(
  '/',
  validateQuery(studentQuerySchema),
  studentController.getStudents
);

router.get(
  '/:id',
  validateId,
  studentController.getStudentDetail
);

router.get(
  '/:id/grades',
  validateId,
  gradeController.getStudentGrades
);

// ── Từ đây trở xuống: bắt buộc đăng nhập ──
router.use(authenticate);

router.post(
  '/',
  validate(studentCreateSchema),
  studentController.createStudent
);

router.patch(
  '/:id',
  validateId,
  validate(studentUpdateSchema),
  studentController.updateStudent
);

router.delete(
  '/:id',
  validateId,
  studentController.deleteStudent
);

// Grade sub-routes (đều cần đăng nhập)
router.post(
  '/:id/grades',
  validateId,
  validate(gradeCreateSchema),
  gradeController.addGrade
);

router.patch(
  '/:id/grades/:gradeId',
  validateId,
  validate(gradeUpdateSchema),
  gradeController.updateGrade
);

router.delete(
  '/:id/grades/:gradeId',
  validateId,
  gradeController.deleteGrade
);

export default router;

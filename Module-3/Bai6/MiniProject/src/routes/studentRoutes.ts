import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
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

// Student endpoints
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

// Grade sub-routes
router.post(
  '/:id/grades',
  validateId,
  validate(gradeCreateSchema),
  gradeController.addGrade
);

router.get(
  '/:id/grades',
  validateId,
  gradeController.getStudentGrades
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

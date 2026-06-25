import { Router } from 'express';
import * as studentController from '../controllers/studentController';
import * as gradeController from '../controllers/gradeController';

const router = Router();

// Student endpoints
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentDetail);
router.post('/', studentController.createStudent);
router.patch('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

// Grade sub-routes
router.post('/:id/grades', gradeController.addGrade);
router.get('/:id/grades', gradeController.getStudentGrades);
router.delete('/:id/grades/:gradeId', gradeController.deleteGrade);

export default router;

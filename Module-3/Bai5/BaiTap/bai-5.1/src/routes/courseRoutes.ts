import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { createCourseSchema, updateCourseSchema, courseQuerySchema, enrollSchema } from '../schemas/courseSchema';
import * as controller from '../controllers/courseController';

const router = Router();

router.get('/', validateQuery(courseQuerySchema), controller.getCourses);
router.get('/:id', validateId, controller.getCourseById);
router.post('/', validate(createCourseSchema), controller.createCourse);
router.patch('/:id', validateId, validate(updateCourseSchema), controller.updateCourse);
router.delete('/:id', validateId, controller.deleteCourse);
router.post('/:id/enroll', validateId, validate(enrollSchema), controller.enrollCourse);

export default router;

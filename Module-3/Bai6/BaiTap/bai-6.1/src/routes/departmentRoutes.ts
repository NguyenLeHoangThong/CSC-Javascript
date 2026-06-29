import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { createDepartmentSchema } from '../schemas/employeeSchema';
import * as controller from '../controllers/departmentController';

const router = Router();

router.get('/', controller.getDepartments);
router.post('/', validate(createDepartmentSchema), controller.createDepartment);
router.delete('/:id', validateId, controller.deleteDepartment);

export default router;

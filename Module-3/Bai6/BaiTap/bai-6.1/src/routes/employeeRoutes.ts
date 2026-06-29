import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { employeeQuerySchema, createEmployeeSchema, updateEmployeeSchema } from '../schemas/employeeSchema';
import * as controller from '../controllers/employeeController';

const router = Router();

// NOTE: /stats must be declared BEFORE /:id so "stats" isn't captured as an :id.
router.get('/stats', controller.getStats);

router.get('/', validateQuery(employeeQuerySchema), controller.getEmployees);
router.get('/:id', validateId, controller.getEmployeeById);
router.post('/', validate(createEmployeeSchema), controller.createEmployee);
router.patch('/:id', validateId, validate(updateEmployeeSchema), controller.updateEmployee);
router.delete('/:id', validateId, controller.deleteEmployee);

export default router;

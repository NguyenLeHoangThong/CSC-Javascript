import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { authorizeOwner } from '../middleware/authorizeOwner';
import { updateTaskSchema } from '../schemas/projectSchema';
import * as controller from '../controllers/taskController';
import { getAssigneeId } from '../services/taskService';

const router = Router();

router.use(authenticate);

// Update task: only the assignee OR admin (admin bypass)
router.patch(
  '/:id',
  validateId,
  authorizeOwner((req) => getAssigneeId(Number(req.params.id))),
  validate(updateTaskSchema),
  controller.updateTask
);

// Delete task: admin only (no owner exception)
router.delete('/:id', authorize('admin'), validateId, controller.deleteTask);

export default router;

import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { authorizeOwner } from '../middleware/authorizeOwner';
import { createProjectSchema, updateProjectSchema, createTaskSchema } from '../schemas/projectSchema';
import * as controller from '../controllers/projectController';
import { getOwnerId } from '../services/projectService';

const router = Router();

// Every project route requires a logged-in user
router.use(authenticate);

// Read: any authenticated role
router.get('/', controller.getProjects);
router.get('/:id', validateId, controller.getProjectById);
router.get('/:id/tasks', validateId, controller.getProjectTasks);

// Create project: user/manager/admin
router.post('/', authorize('user', 'manager', 'admin'), validate(createProjectSchema), controller.createProject);

// Create task in a project: manager/admin only
router.post('/:id/tasks', authorize('manager', 'admin'), validateId, validate(createTaskSchema), controller.createProjectTask);

// Update/delete project: owner OR admin (admin bypass inside authorizeOwner)
router.patch(
  '/:id',
  validateId,
  authorizeOwner((req) => getOwnerId(Number(req.params.id))),
  validate(updateProjectSchema),
  controller.updateProject
);
router.delete(
  '/:id',
  validateId,
  authorizeOwner((req) => getOwnerId(Number(req.params.id))),
  controller.deleteProject
);

export default router;

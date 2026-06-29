import { Router } from 'express';
import { validate, validateId, validateQuery } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { authorizeOwner } from '../middleware/authorizeOwner';
import { updateProfileSchema, updateRoleSchema, userQuerySchema } from '../schemas/userSchema';
import * as controller from '../controllers/userController';

const router = Router();

// All /users routes require login
router.use(authenticate);

// Admin only
router.get('/', authorize('admin'), validateQuery(userQuerySchema), controller.getUsers);
router.get('/:id', authorize('admin'), validateId, controller.getUserById);

// Update profile: self OR admin (the resource owner is the user id in the path)
router.patch(
  '/:id',
  validateId,
  authorizeOwner(async (req) => parseInt(req.params.id, 10)),
  validate(updateProfileSchema),
  controller.updateProfile
);

// Change role / delete: admin only (and not on self — checked in service → 400)
router.patch('/:id/role', authorize('admin'), validateId, validate(updateRoleSchema), controller.updateRole);
router.delete('/:id', authorize('admin'), validateId, controller.deleteUser);

export default router;

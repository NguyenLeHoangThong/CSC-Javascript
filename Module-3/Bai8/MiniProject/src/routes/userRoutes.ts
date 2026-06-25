import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { authorizeOwner } from '../middleware/authorizeOwner';
import { validate, validateId, validateQuery } from '../middleware/validate';
import {
  updateProfileSchema,
  updateRoleSchema,
  userQuerySchema,
} from '../schemas/userSchema';
import * as controller from '../controllers/userController';

const router = Router();

// Mọi route /users đều yêu cầu đăng nhập
router.use(authenticate);

// GET /users — chỉ admin (?role=&search=&page=&limit=)
router.get(
  '/',
  authorize('admin'),
  validateQuery(userQuerySchema),
  controller.getUsers
);

// GET /users/:id — chỉ admin
router.get('/:id', authorize('admin'), validateId, controller.getUserById);

// PATCH /users/:id — chính chủ hoặc admin (update name, email)
router.patch(
  '/:id',
  validateId,
  authorizeOwner(async (req) => parseInt(req.params.id, 10)),
  validate(updateProfileSchema),
  controller.updateProfile
);

// PATCH /users/:id/role — chỉ admin, không tự đổi role mình
router.patch(
  '/:id/role',
  authorize('admin'),
  validateId,
  validate(updateRoleSchema),
  controller.updateRole
);

// DELETE /users/:id — chỉ admin, không tự xóa mình
router.delete('/:id', authorize('admin'), validateId, controller.deleteUser);

export default router;

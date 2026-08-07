import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { userQuerySchema, userRoleSchema } from '../schemas/userSchema';
import * as controller from '../controllers/userController';

const router = Router();

// Bài 36 — the whole resource is admin-only: a customer has no business listing
// other accounts. Applied with router.use() so a route added later cannot forget it.
router.use(authenticate, authorize('admin'));

router.get('/', validateQuery(userQuerySchema), controller.getUsers);
router.get('/:id', validateId, controller.getUserById);
router.patch('/:id/role', validateId, validate(userRoleSchema), controller.updateUserRole);
router.delete('/:id', validateId, controller.deleteUser);

export default router;

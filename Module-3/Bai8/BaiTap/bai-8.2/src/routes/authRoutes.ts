import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { registerSchema, loginSchema } from '../schemas/authSchema';
import * as controller from '../controllers/authController';

const router = Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.get('/me', authenticate, controller.me);
router.post('/logout', authenticate, controller.logout);

export default router;

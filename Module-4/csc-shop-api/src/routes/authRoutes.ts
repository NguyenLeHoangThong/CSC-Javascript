import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { registerSchema, loginSchema, refreshSchema } from '../schemas/authSchema';
import * as controller from '../controllers/authController';

const router = Router();

// Public auth endpoints
router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshSchema), controller.refresh);

// Require a valid access token
router.get('/me', authenticate, controller.me);
router.post('/logout', authenticate, controller.logout);

export default router;

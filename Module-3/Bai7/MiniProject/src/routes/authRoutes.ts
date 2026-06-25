import { Router } from 'express';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from '../schemas/authSchema';
import * as controller from '../controllers/authController';

const router = Router();

// POST /api/v1/auth/register — đăng ký tài khoản mới
router.post('/register', validate(registerSchema), controller.register);

// POST /api/v1/auth/login — đăng nhập, lấy access + refresh token
router.post('/login', validate(loginSchema), controller.login);

// POST /api/v1/auth/refresh — lấy access token mới bằng refresh token
router.post('/refresh', validate(refreshSchema), controller.refresh);

// GET /api/v1/auth/me — thông tin user hiện tại (cần token)
router.get('/me', authenticate, controller.me);

// POST /api/v1/auth/logout — đăng xuất, revoke refresh token (cần token)
router.post('/logout', authenticate, controller.logout);

export default router;

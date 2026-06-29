import { Router } from 'express';
import * as controller from '../controllers/categoryController';

const router = Router();

router.get('/', controller.getCategories);

export default router;

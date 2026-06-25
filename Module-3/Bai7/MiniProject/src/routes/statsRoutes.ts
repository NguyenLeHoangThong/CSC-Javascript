import { Router } from 'express';
import * as controller from '../controllers/statsController';

const router = Router();

router.get('/', controller.getStats);

export default router;

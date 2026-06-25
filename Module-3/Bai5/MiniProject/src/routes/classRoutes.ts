import { Router } from 'express';
import * as classController from '../controllers/classController';

const router = Router();

router.get('/', classController.getClasses);
router.get('/:id', classController.getClassDetail);
router.post('/', classController.createClass);
router.patch('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

export default router;

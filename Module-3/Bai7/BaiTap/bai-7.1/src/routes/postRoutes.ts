import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { createPostSchema, updatePostSchema } from '../schemas/postSchema';
import * as controller from '../controllers/postController';

const router = Router();

// Public reads
router.get('/', controller.getPosts);
router.get('/:id', validateId, controller.getPostById);

// Logged-in only; author-only for update/delete (checked in service)
router.post('/', authenticate, validate(createPostSchema), controller.createPost);
router.patch('/:id', authenticate, validateId, validate(updatePostSchema), controller.updatePost);
router.delete('/:id', authenticate, validateId, controller.deletePost);

export default router;

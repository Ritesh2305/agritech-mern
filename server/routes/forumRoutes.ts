import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getPosts,
  getPostById,
  createPost,
  addComment,
  likePost,
  moderatePost,
} from '../controllers/forumController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

router
  .route('/')
  .get(getPosts)
  .post(
    protect,
    [
      body('title').trim().notEmpty().withMessage('Post title is required'),
      body('content').trim().notEmpty().withMessage('Post content is required'),
      body('category').optional().isString(),
    ],
    validateRequest,
    createPost
  );

router
  .route('/:id')
  .get(
    [param('id').notEmpty().withMessage('Post ID is required')],
    validateRequest,
    getPostById
  )
  .delete(
    protect,
    [param('id').notEmpty().withMessage('Post ID is required')],
    validateRequest,
    moderatePost
  );

router.post(
  '/:id/comments',
  protect,
  [
    param('id').notEmpty().withMessage('Post ID is required'),
    body('content').trim().notEmpty().withMessage('Comment content is required'),
  ],
  validateRequest,
  addComment
);

router.put(
  '/:id/like',
  protect,
  [param('id').notEmpty().withMessage('Post ID is required')],
  validateRequest,
  likePost
);

export default router;

import express from 'express';
import {
  getPosts,
  createPost,
  getPostById,
  addComment,
  toggleLike,
  deletePost,
  flagPost
} from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

router.use(protect);

router.post('/', upload.single('image'), createPost);
router.post('/:id/comments', addComment);
router.post('/:id/like', toggleLike);
router.post('/:id/flag', flagPost);
router.delete('/:id', deletePost);

export default router;


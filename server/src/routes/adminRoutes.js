import express from 'express';
import {
  getAdminMetrics,
  listUsers,
  updateUserRoleOrStatus,
  getFlaggedPosts,
  moderatePost
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/metrics', getAdminMetrics);
router.get('/users', listUsers);
router.put('/users/:id', updateUserRoleOrStatus);
router.get('/flagged-posts', getFlaggedPosts);
router.post('/moderate-post/:id', moderatePost);

export default router;


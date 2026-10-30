import express from 'express';
import {
  getMyActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  generateCropSchedule
} from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyActivities);
router.post('/', createActivity);
router.post('/generate-schedule', generateCropSchedule);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;


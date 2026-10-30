import express from 'express';
import {
  submitExpertRequest,
  getMyRequests,
  getExpertRequests,
  getRequestById,
  respondToRequest,
  addFollowUp,
  rateConsultation
} from '../controllers/expertController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/consult', upload.single('image'), submitExpertRequest);
router.get('/my-requests', getMyRequests);
router.get('/expert-feed', authorize('expert', 'admin'), getExpertRequests);
router.get('/:id', getRequestById);
router.post('/:id/respond', authorize('expert', 'admin'), respondToRequest);
router.post('/:id/message', addFollowUp);
router.post('/:id/rate', rateConsultation);

export default router;


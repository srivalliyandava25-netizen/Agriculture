import express from 'express';
import {
  getFertilizerAdvisory,
  getMyFertilizerAdvisories
} from '../controllers/fertilizerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/advisory', getFertilizerAdvisory);
router.get('/my-advisories', getMyFertilizerAdvisories);

export default router;


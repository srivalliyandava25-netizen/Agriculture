import express from 'express';
import {
  getCropRecommendations,
  getMyCropRecommendations,
  deleteCropRecommendation,
  getCropCatalog
} from '../controllers/cropController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/catalog', getCropCatalog);
router.post('/recommend', protect, getCropRecommendations);
router.get('/my-recommendations', protect, getMyCropRecommendations);
router.delete('/recommendations/:id', protect, deleteCropRecommendation);

export default router;


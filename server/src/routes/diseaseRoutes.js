import express from 'express';
import {
  detectCropDisease,
  getMyDiseaseAnalyses,
  deleteDiseaseAnalysis
} from '../controllers/diseaseController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/detect', upload.single('image'), detectCropDisease);
router.get('/history', getMyDiseaseAnalyses);
router.delete('/history/:id', deleteDiseaseAnalysis);

export default router;


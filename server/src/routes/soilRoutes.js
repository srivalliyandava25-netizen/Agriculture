import express from 'express';
import {
  uploadAndAnalyzeSoil,
  getMySoilReports,
  getSoilReportById,
  deleteSoilReport
} from '../controllers/soilController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', upload.single('image'), uploadAndAnalyzeSoil);
router.get('/reports', getMySoilReports);
router.get('/reports/:id', getSoilReportById);
router.delete('/reports/:id', deleteSoilReport);

export default router;


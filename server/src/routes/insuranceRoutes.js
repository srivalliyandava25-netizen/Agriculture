import express from 'express';
import {
  reportDamageIncident,
  getMyDamageIncidents,
  deleteDamageIncident
} from '../controllers/insuranceController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/report-damage', upload.single('photo'), reportDamageIncident);
router.get('/my-incidents', getMyDamageIncidents);
router.delete('/incidents/:id', deleteDamageIncident);

export default router;


import express from 'express';
import { getPrices, getTransportCalculation } from '../controllers/marketController.js';

const router = express.Router();

router.get('/prices', getPrices);
router.post('/transport-calculator', getTransportCalculation);

export default router;


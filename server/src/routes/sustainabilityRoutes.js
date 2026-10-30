import express from 'express';
import { getGuides, getGuideBySlug } from '../controllers/sustainabilityController.js';

const router = express.Router();

router.get('/guides', getGuides);
router.get('/guides/:slug', getGuideBySlug);

export default router;


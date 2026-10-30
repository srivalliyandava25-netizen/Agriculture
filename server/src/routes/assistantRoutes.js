import express from 'express';
import { generateGeneralVoiceAnswer } from '../services/consultationAIService.js';

const router = express.Router();

router.post('/ask', async (req, res, next) => {
  try {
    const question = String(req.body?.question || '').trim();
    if (!question) return res.status(400).json({ success: false, message: 'Question is required.' });
    const languageCode = String(req.body?.languageCode || 'en');
    const answer = await generateGeneralVoiceAnswer({ question, languageCode });
    res.status(200).json({ success: true, answer });
  } catch (error) {
    next(error);
  }
});

export default router;

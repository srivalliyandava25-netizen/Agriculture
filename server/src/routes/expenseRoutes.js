import express from 'express';
import {
  calculateAndSaveExpense,
  getMyExpenses,
  deleteExpense
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/calculate', protect, calculateAndSaveExpense);
router.get('/my-records', protect, getMyExpenses);
router.delete('/records/:id', protect, deleteExpense);

export default router;


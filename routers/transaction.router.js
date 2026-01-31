import express from 'express';
import {
    createTransaction,
    getTransactionHistory
} from '../controllers/transaction.controller.js';
import { trasactionlimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.get('/history', getTransactionHistory);
router.post('/create', trasactionlimiter,createTransaction);


export default router;

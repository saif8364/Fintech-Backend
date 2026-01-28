import express from 'express';
import {
    createTransaction,
    getTransactionHistory
} from '../controllers/transaction.controller.js';

const router = express.Router();

router.get('/history', getTransactionHistory);
router.post('/create', createTransaction);


export default router;

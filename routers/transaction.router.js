import express from 'express';
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionHistory
} from '../controllers/transaction.controller.js';

const router = express.Router();

// GET routes
router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.get('/history/:userId', getTransactionHistory);

// POST routes
router.post('/create', createTransaction);

// PUT routes
router.put('/update/:id', updateTransaction);

// DELETE routes
router.delete('/delete/:id', deleteTransaction);

export default router;

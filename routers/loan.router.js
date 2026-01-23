import express from 'express';
import {
    getLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan,
    getLoansByUserId,
    approveLoan,
    rejectLoan
} from '../controllers/loan.controller.js';

const router = express.Router();

// GET routes
router.get('/', getLoans);
router.get('/:id', getLoanById);
router.get('/user/:userId', getLoansByUserId);

// POST routes
router.post('/create', createLoan);

// PUT routes
router.put('/update/:id', updateLoan);
router.put('/approve/:id', approveLoan);
router.put('/reject/:id', rejectLoan);

// DELETE routes
router.delete('/delete/:id', deleteLoan);

export default router;

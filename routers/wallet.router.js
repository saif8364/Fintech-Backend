import express from 'express';
import {
    getWallet,
    createWallet,
    updateWalletBalance,
    deleteWallet,
    getWalletBalance
} from '../controllers/wallet.controller.js';

const router = express.Router();

// GET routes
router.get('/', getWallet);
router.get('/balance', getWalletBalance);

// POST routes
router.post('/create', createWallet);

// PUT routes
router.put('/update', updateWalletBalance);

// DELETE routes
router.delete('/delete/:id', deleteWallet);

export default router;

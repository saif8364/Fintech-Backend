import express from 'express';
import {
    getWallet,
    createWallet,
    updateWalletBalance,
    getWalletBalance,
    getWalletbyNumber
} from '../controllers/wallet.controller.js';

const router = express.Router();

// GET routes
router.get('/getwallet', getWallet);
router.get('/balance', getWalletBalance);

// POST routes
router.post('/create', createWallet);

// PUT routes
router.put('/update', updateWalletBalance);
router.get('/getbyphone', getWalletbyNumber);


export default router;

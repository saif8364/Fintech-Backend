import express from 'express';
import {
    getWallet,
    createWallet,
    getWalletBalance,
    getWalletbyNumber,
    changePin,
    changeUsername,
    verifyPin
} from '../controllers/wallet.controller.js';
import { changelimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// GET routes
router.get('/getwallet', getWallet);
router.get('/getbalance', getWalletBalance);

// POST routes
router.post('/create', createWallet);

// PUT routes
router.get('/getbyphone', getWalletbyNumber);
router.post('/changepin', changelimiter, changePin);
router.post('/changeusername', changelimiter, changeUsername);
router.get('/verifyPin',verifyPin);





export default router;

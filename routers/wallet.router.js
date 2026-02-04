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
import { changeusername_limiter,changepin_limiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// GET routes
router.get('/getwallet', getWallet);
router.get('/getbalance', getWalletBalance);

// POST routes
router.post('/createwallet', createWallet);

// PUT routes
router.get('/getbyphone', getWalletbyNumber);
router.post('/changepin', changepin_limiter, changePin);
router.post('/changeusername', changeusername_limiter, changeUsername);
router.get('/verifyPin',verifyPin);





export default router;

import express from 'express';
import {
    getWallet,
    createWallet,
    getWalletBalance,
    getWalletbyNumber,
    getWalletwithoutCached,
    changePin,
    changeUsername,
    verifyPin
} from '../controllers/wallet.controller.js';
import { changeusername_limiter,changepin_limiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// GET 
router.get('/getwallet', getWallet);
router.get('/getwalletwithoutcached', getWalletwithoutCached);
router.get('/getbalance', getWalletBalance);
router.get('/getbyphone', getWalletbyNumber);
router.get('/verifyPin',verifyPin);

// POST routes
router.post('/createwallet', createWallet);
router.post('/changepin', changepin_limiter, changePin);
router.post('/changeusername', changeusername_limiter, changeUsername);






export default router;

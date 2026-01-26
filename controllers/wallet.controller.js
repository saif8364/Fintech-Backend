import {sql} from '../db.js';
import { errorResponse } from '../utils/errorResponse.js';
import {successResponse} from '../utils/successResponse.js';
import { uuidv7 } from 'uuidv7';

// Get wallet by user ID
export const getWallet = async (req, res) => {
   const {wallet_name, phone_no,wallet_pin} = req.body;

   if(wallet_name&&phone_no&&wallet_pin){
     try {
            let query=await sql `INSERT INTO wallets (wallet_id, wallet_name, phone_no, balance, wallet_pin) VALUES (${uuidv7()},${wallet_name},${phone_no},100000,${wallet_pin})`;
            successResponse(res, 'Wallet created successfully', query);
            
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

   }
   else{
    errorResponse(res,"All Fields Required",401)
   }

   
};

// Create wallet for user
export const createWallet = async (req, res) => {
    try {
        // TODO: Implement createWallet logic
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update wallet balance
export const updateWalletBalance = async (req, res) => {
    try {
        // TODO: Implement updateWalletBalance logic
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete wallet
export const deleteWallet = async (req, res) => {
    try {
        // TODO: Implement deleteWallet logic
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get wallet balance
export const getWalletBalance = async (req, res) => {
    try {
        // TODO: Implement getWalletBalance logic
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

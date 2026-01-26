import {sql} from '../db.js';
import { errorResponse } from '../utils/errorResponse.js';
import {successResponse} from '../utils/successResponse.js';
import { uuidv7 } from 'uuidv7';

// Create Wallet for user ID
export const createWallet = async (req, res) => {

   const {wallet_name, phone_no,wallet_pin} = req.body;
   console.log(req.user.user_id,wallet_name, phone_no,wallet_pin);

   if(wallet_name&&phone_no&&wallet_pin){
     try {
            let query=await sql `INSERT INTO wallets (user_id,wallet_id, wallet_name, phone_no, balance, wallet_pin) VALUES (${req.user.user_id},${uuidv7()},${wallet_name},${phone_no},100000,${wallet_pin})`;
            successResponse(res, 'Wallet created successfully', query);
            
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

   }
   else{
    errorResponse(res,"All Fields Required",401)
   }

   
};

// get wallet for user
export const getWallet = async (req, res) => {
    try {
        let wallet=await sql `SELECT * FROM wallets WHERE user_id=${req.user.user_id}`
        successResponse(res, 'Wallet retrieved successfully', wallet);
        
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

export const getWalletBalance = async (req, res) => {
    try {
        let balance=await sql `SELECT balance FROM wallets WHERE user_id=${req.user.user_id}`
        successResponse(res, 'Balance retrieved successfully', balance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWalletbyNumber = async (req, res) => {
    const {phone_no} = req.body;
    if(!phone_no){
        return errorResponse(res,"Phone Number is required",401)
    }

    try {
        let wallet=await sql `SELECT * FROM wallets WHERE phone_no=${phone_no}`
        console.log(wallet);
        
        if(wallet.length==0){
            return errorResponse(res,"Wallet not found",404)
        }
        successResponse(res, 'Wallet retrieved successfully', wallet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





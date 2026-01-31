import {sql} from '../db.js';
import { errorResponse } from '../utils/errorResponse.js';
import {successResponse} from '../utils/successResponse.js';
import { uuidv7 } from 'uuidv7';
import { getRedis } from '../utils/redis_server.js';
import { hashPassword ,comparePassword} from '../utils/passwordHashing.js';


let redisClient = await getRedis()

// Create Wallet for user ID
export const createWallet = async (req, res) => {

   const {wallet_name, phone_no,wallet_pin} = req.body;
   const hashedPin=await hashPassword(wallet_pin);
   console.log(req.user.user_id,wallet_name, phone_no,wallet_pin);

   if(wallet_name&&phone_no&&wallet_pin){
     try {
            let query=await sql `INSERT INTO wallets (user_id,wallet_id, wallet_name, phone_no, balance, wallet_pin) VALUES (${req.user.user_id},${uuidv7()},${hashedPin})`;
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
    let cached=await redisClient.get(`wallet_${req.user.user_id}`);
    if(cached){
        return successResponse(res, 'Wallet retrieved successfully', cached);
    }

    try {
        let wallet=await sql `SELECT * FROM wallets WHERE user_id=${req.user.user_id}`
        let data=await redisClient.set(`wallet_${req.user.user_id}`, JSON.stringify(wallet), { EX: 80000 }); 
        console.log("data saved in redis:",data );
             
        successResponse(res, 'Wallet retrieved successfully', wallet);
        
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

    let cached=await redisClient.get(`wallet_phone_${phone_no}`);
    if(cached){
        console.log('cache hit',cached);
        return successResponse(res, 'Wallet retrieved successfully(from redis)', cached);
    }

    if(!phone_no){
        return errorResponse(res,"Phone Number is required",401)
    }

    try {
        let wallet=await sql `SELECT * FROM wallets WHERE phone_no=${phone_no}`
        console.log(wallet);
        
        if(wallet.length==0){
            return errorResponse(res,"Wallet not found",404)
        }
        let data=await redisClient.set(`wallet_phone_${phone_no}`, JSON.stringify(wallet), { EX: 3600 });
        console.log("data saved in redis:",data );
        successResponse(res, 'Wallet retrieved successfully', wallet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const changePin = async (req, res) => {
    try {
        const {old_pin,new_pin} = req.body;

        if(!old_pin || !new_pin){
            return errorResponse(res, "Old pin and new pin are required", 401);
        }
        const hashedNewPin=await hashPassword(new_pin);
        const oldhashedpin=await sql `Select wallet_pin FROM wallets WHERE user_id=${req.user.user_id}`;
        const validateOldPin=await comparePassword(old_pin,oldhashedpin[0].wallet_pin);

        if(!validateOldPin){
            return errorResponse(res, "Old pin is incorrect", 401);
        }

        await sql `UPDATE wallets SET wallet_pin=${hashedNewPin} WHERE user_id=${req.user.user_id}`;
        successResponse(res, 'Pin changed successfully', null);

    } catch (error) {
     return errorResponse(res, error.message, 500);
    }
}

export const verifyPin = async (req, res) => {
    try {
        const {wallet_pin} = req.body;
        if(!wallet_pin){
            return errorResponse(res, "Wallet pin is required", 401);
        }
        const hashedpin=await sql `Select wallet_pin FROM wallets WHERE user_id=${req.user.user_id}`;
        const validatePin=await comparePassword(wallet_pin,hashedpin[0].wallet_pin);
        if(!validatePin){
            return errorResponse(res, "Wallet pin is incorrect", 401);
        }
        successResponse(res, 'Pin verified successfully', null);

    } catch (error) {
       return errorResponse(res, error.message, 500);
    }
}


export const changeUsername = async (req, res) => {
    const {new_username} = req.body;
   try {

    if(!new_username){
        return errorResponse(res, "New username is required", 401);
    }
    await sql `UPDATE users SET username=${new_username} WHERE user_id=${req.user.user_id}`;
    successResponse(res, 'Username changed successfully', null);

   } catch (error) {
       return errorResponse(res, error.message, 500);
   }
}










import {sql} from '../db.js';
import { errorResponse } from '../utils/errorResponse.js';
import {successResponse} from '../utils/successResponse.js';
import { getRedis } from '../utils/redis_server.js';
import { hashPassword ,comparePassword} from '../utils/passwordHashing.js';


let redisClient = await getRedis()

// Create Wallet for user ID
export const createWallet = async (req, res) => {

   const {wallet_name, phone_no,wallet_pin} = req.body;
   console.log(req.user.user_id,wallet_name, phone_no,wallet_pin);

   if(!wallet_name||!phone_no||!wallet_pin){
    errorResponse(res,'All fields required ',401)
   }

    let user=await sql `Select wallet_id from wallets where wallet_id=${req.user.user_id}`
    console.log(user);
   if(user.length!=0){
   return errorResponse(res,'Already have a wallet ',401)
   }


      const hashedPin=await hashPassword(wallet_pin);

     try {
            let query=await sql `INSERT INTO wallets (wallet_id, wallet_name, phone_no, balance, wallet_pin) VALUES (${req.user.user_id},${wallet_name},${phone_no},0,${hashedPin}) RETURNING *`;
            successResponse(res, query,'Wallet created successfully');
            
    } catch (error) {

        if(error.code=='23505'){
            errorResponse(res,'This phone number already exists.',401)
        }
        else{
            errorResponse(res,'SomeThing went wrong',401)
        }
    }

  

   
};

// get wallet for user
export const getWallet = async (req, res) => {
    let cached=await redisClient.get(`wallet_${req.user.user_id}`);
    if(cached){
        log('cache hit',cached);
        return successResponse(res, cached, 'Wallet retrieved successfully');
    }
    console.log('entered getwallet');
    
    try {
        let wallet=await sql `SELECT * FROM wallets WHERE wallet_id=${req.user.user_id} `
        if(wallet.length==0){
            log('wallet not found');
            return errorResponse(res,"Wallet not found",404)
        }
        let data=await redisClient.set(`wallet_${req.user.user_id}`, JSON.stringify(wallet), { EX: 2500 }); 
        console.log("data saved in redis:",wallet);
        successResponse(res, wallet, 'Wallet retrieved successfully');
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWalletwithoutCached = async (req, res) => {
    
    try {
        let wallet=await sql `SELECT * FROM wallets WHERE wallet_id=${req.user.user_id}`
        let data=await redisClient.set(`wallet_${req.user.user_id}`, JSON.stringify(wallet), { EX: 2500 }); 
        console.log("data saved in redis:",wallet);
        
        successResponse(res, wallet, 'Wallet retrieved successfully');
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getWalletBalance = async (req, res) => {
    try {
        let balance=await sql `SELECT balance FROM wallets WHERE wallet_id=${req.user.user_id}`
        successResponse(res, balance, 'Balance retrieved successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWalletbyNumber = async (req, res) => {
    const {phone_no} = req.body;

     if(!phone_no){
        return errorResponse(res,"Phone Number is required",401)
    }

    let cached=await redisClient.get(`wallet_phone_${phone_no}`);
    if(cached){
        console.log('cache hit',cached);
        return successResponse(res, cached, 'Wallet retrieved successfully(from redis)');
    }

   

    try {
        let wallet=await sql `SELECT * FROM wallets WHERE phone_no=${phone_no}`
        console.log(wallet);
        
        if(wallet.length==0){
            return errorResponse(res,"Wallet not found",404)
        }
        let data=await redisClient.set(`wallet_phone_${phone_no}`, JSON.stringify(wallet), { EX: 3600 });
        console.log("data saved in redis:",data );
        successResponse(res, wallet, 'Wallet retrieved successfully');
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
        if(old_pin==new_pin){
            return errorResponse(res,"Old and New pin cannot be same")
        }

        const hashedNewPin=await hashPassword(new_pin);
        const oldhashedpin=await sql `Select wallet_pin FROM wallets WHERE wallet_id=${req.user.user_id}`;
        const validateOldPin=await comparePassword(old_pin,oldhashedpin[0].wallet_pin);

        if(!validateOldPin){
            return errorResponse(res, "Old pin is incorrect", 401);
        }

        await sql `UPDATE wallets SET wallet_pin=${hashedNewPin} WHERE wallet_id=${req.user.user_id}`;
        successResponse(res, 'Pin changed successfully');

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
        const hashedpin=await sql `Select wallet_pin FROM wallets WHERE wallet_id=${req.user.user_id}`;
        const validatePin=await comparePassword(wallet_pin,hashedpin[0].wallet_pin);
        if(!validatePin){
            return errorResponse(res, "Wallet pin is incorrect", 401);
        }
        successResponse(res, 'Wallet pin verified successfully');

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
    await sql `UPDATE wallets SET wallet_name=${new_username} WHERE wallet_id=${req.user.user_id}`;
    successResponse(res, 'Username changed successfully');

   } catch (error) {
       return errorResponse(res, error.message, 500);
   }
}










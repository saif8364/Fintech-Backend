import {sql} from '../db.js';
import { errorResponse } from '../utils/errorResponse.js';
import {successResponse} from '../utils/successResponse.js';
import { uuidv7 } from 'uuidv7';
import { getRedis } from '../utils/redis_server.js';

const redisClient = await getRedis();


// Create transaction
export const createTransaction = async (req, res) => {
    try {
        const { phone_no, amount } = req.body;
        const tx_id=uuidv7()
        let senderWallet, recipientWallet;


        if (!phone_no || !amount) {
            return errorResponse(res, "Phone number and amount are required", 401);
        }

        if(amount<=0){
            return errorResponse(res, "Amount must be greater than zero", 401);
        }


        let cached_senderWallet=await redisClient.get(`wallet_${req.user.user_id}`);
        
        if(!cached_senderWallet){
            const from_user=req.user.user_id;
            senderWallet=await sql `SELECT wallet_id FROM wallets WHERE user_id=${from_user}`
        }
         
       let cached_phone=await redisClient.get(`wallet_phone_${phone_no}`);


       if(!cached_phone){

            recipientWallet=await sql `SELECT wallet_id FROM wallets WHERE phone_no=${phone_no}`  
            if(recipientWallet.length==0){
                return errorResponse(res, "Recipient wallet not found", 404);
            }

       }

       console.log('Cached Sender:',cached_senderWallet);
       console.log('Cached Recipient:',cached_phone);
       

       const senderWalletId = senderWallet?.[0]?.wallet_id || cached_senderWallet?.[0]?.wallet_id;
       const recipientWalletId = recipientWallet?.[0]?.wallet_id || cached_phone?.[0]?.wallet_id;


         await sql.begin(
            async (tx)=>{

                await tx `select handle_transaction(${tx_id}, ${senderWalletId}, ${recipientWalletId}, ${amount})`
            }
        ) 
        
       
        successResponse(res,tx_id ,'Transaction created successfully');

    } catch (error) {
        console.log("Error:",error);
        
       
        return errorResponse(res, error.message, 500);
    }
};


//will optimize later with caching
export const getTransactionHistory = async (req, res) => {
    try {
        let transactions=await sql `SELECT * FROM transactions WHERE from_wallet_id IN (SELECT wallet_id FROM wallets WHERE user_id=${req.user.user_id}) OR to_wallet_id IN (SELECT wallet_id FROM wallets WHERE user_id=${req.user.user_id}) ORDER BY created_at DESC`
        successResponse(res, transactions, 'Transaction history retrieved successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

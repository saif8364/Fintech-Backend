import {sql} from '../db.js';
import { errorResponse } from '../utils/errorResponse.js';
import {successResponse} from '../utils/successResponse.js';
import { uuidv7 } from 'uuidv7';
import { getRedis } from '../utils/redis_server.js';
import { trasactionlimiter } from '../middlewares/rateLimit.middleware.js';

const redisClient = await getRedis();


// Create transaction
export const createTransaction = async (req, res) => {
    try {
        const { phone_no, amount } = req.body;
        const tx_id=uuidv7()
        let senderWallet,recipientWallet;
        const from_user=req.user.user_id; 

        if (!phone_no || !amount) {
            return errorResponse(res, "Phone number and amount are required", 401);
        }

        if(amount<=0){
            return errorResponse(res, "Amount must be greater than zero", 401);
        }
       
       
        senderWallet=await sql `SELECT * FROM wallets WHERE wallet_id=${from_user}`
       let cached_phone=await redisClient.get(`wallet_phone_${phone_no}`);


       if(!cached_phone){

            recipientWallet=await sql `SELECT wallet_id FROM wallets WHERE phone_no=${phone_no}`  
            if(recipientWallet.length==0){
                return errorResponse(res, "Recipient wallet not found", 404);
            }

       }

       console.log(' Sender:',senderWallet);
       console.log('Cached Recipient:',cached_phone);

       let SenderPhone=senderWallet[0]?.phone_no;
       if(SenderPhone===phone_no){
        return errorResponse(res, "Cannot transfer to the same wallet", 401);
       }
       
       const SenderWalletId = senderWallet?.[0]?.wallet_id;
       const recipientWalletId = recipientWallet?.[0]?.wallet_id || cached_phone?.[0]?.wallet_id;


         await sql.begin(
            async (tx)=>{

                await tx `select handle_transaction(${tx_id}, ${SenderWalletId}, ${recipientWalletId}, ${amount})`
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
    console.log('enterd history controller');
    
    try {

        const query = await sql`
        SELECT
        t.transaction_id,
        t.amount,
        t.created_at,

        wf.wallet_id   AS from_wallet_id,
        wf.wallet_name AS from_wallet_name,
        wf.phone_no    AS from_phone,

        wt.wallet_id   AS to_wallet_id,
        wt.wallet_name AS to_wallet_name,
        wt.phone_no    AS to_phone

        FROM transactions t
        JOIN wallets wf ON t.from_wallet_id = wf.wallet_id
        JOIN wallets wt ON t.to_wallet_id = wt.wallet_id
        WHERE t.from_wallet_id = ${req.user.user_id}
        OR t.to_wallet_id   = ${req.user.user_id};
`;       
        console.log(query);
        successResponse(res, query, 'Transaction history retrieved successfully');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

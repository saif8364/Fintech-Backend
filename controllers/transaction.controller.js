import {sql} from '../db.js';
import { errorResponse } from '../utils/errorResponse.js';
import {successResponse} from '../utils/successResponse.js';
import { uuidv7 } from 'uuidv7';


// Create transaction
export const createTransaction = async (req, res) => {
    try {
        const { phone_no, amount } = req.body;
        if (!phone_no || !amount) {
            return errorResponse(res, "Phone number and amount are required", 401);
        }
        let to_wallet=await sql `SELECT wallet_id FROM wallets WHERE phone_no=${phone_no}`  
        console.log('To Wallelt:',to_wallet);
        if(to_wallet.length==0){
            return errorResponse(res, "Recipient wallet not found", 404);
        }
        
        const tx_id=uuidv7()
        const from_user=req.user.user_id;
        let from_wallet=await sql `SELECT wallet_id FROM wallets WHERE user_id=${from_user}`
        console.log("From Wallet",from_wallet);
        
        


        await sql.begin(
            async (tx)=>{
                await tx `Begin`
                await tx `select handle_transaction(${tx_id}, ${from_wallet[0].wallet_id}, ${to_wallet[0].wallet_id}, ${amount})`
                await tx `COMMIT`
            }
        ) 
        successResponse(res, 'Transaction created successfully',tx_id );

    } catch (error) {
        console.log("Error:",error);
        
        res.status(500).json({ error: error.message });
    }
};



export const getTransactionHistory = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

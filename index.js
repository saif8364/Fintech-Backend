import { verifyIdToken } from './middlewares/firebase.js';
import { configDotenv } from 'dotenv';
import express from 'express';
import transactionRouter from './routers/transaction.router.js';
import walletRouter from './routers/wallet.router.js';


const app = express();
configDotenv();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/wallet', walletRouter);
app.use('/transaction', verifyIdToken,transactionRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



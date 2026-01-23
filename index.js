import sql from './db.js';
import { configDotenv } from 'dotenv';
import express from 'express';
import loanRouter from './routers/loan.router.js';
import transactionRouter from './routers/transaction.router.js';
import walletRouter from './routers/wallet.router.js';

const app = express();
configDotenv();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/wallet', walletRouter);
app.use('/transaction', transactionRouter);
app.use('/loan', loanRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



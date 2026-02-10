CREATE TABLE wallets (
    user_id varchar(255) NOT NULL unique,
    wallet_id VARCHAR(255) PRIMARY KEY,
    wallet_name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(20) NOT NULL unique,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    wallet_pin VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    transaction_id VARCHAR(255) PRIMARY KEY,
    from_wallet_id VARCHAR(255) ,
    to_wallet_id VARCHAR(255) ,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(50) NOT NULL,  
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Foreign Keys
    FOREIGN KEY (from_wallet_id) REFERENCES wallets(wallet_id) ON DELETE SET NULL,
    FOREIGN KEY (to_wallet_id) REFERENCES wallets(wallet_id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION handle_transaction(
    p_transaction_id TEXT,
    p_from_wallet    TEXT,
    p_to_wallet      TEXT,
    p_amount         DECIMAL  
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    sender_balance DECIMAL(15,2);
BEGIN
    -- Get sender balance
    SELECT balance
    INTO sender_balance
    FROM wallets
    WHERE wallet_id = p_from_wallet;

    -- Check if balance is sufficient
    IF sender_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;

    -- Lock wallets to prevent concurrent modification
    PERFORM 1 FROM wallets WHERE wallet_id = p_from_wallet FOR UPDATE;
    PERFORM 1 FROM wallets WHERE wallet_id = p_to_wallet FOR UPDATE;

    -- Debit row (money leaving sender)
    INSERT INTO transactions (
        transaction_id,
        from_wallet_id,
        to_wallet_id,
        amount,
        type
    ) VALUES (
        p_transaction_id || '-D',
        p_from_wallet,
        p_to_wallet,
        -p_amount,
        'Sender'
    );

    -- Credit row (money going to receiver)
    INSERT INTO transactions (
        transaction_id,
        from_wallet_id,
        to_wallet_id,
        amount,
        type
    ) VALUES (
        p_transaction_id || '-C',
        p_from_wallet,
        p_to_wallet,
        p_amount,
        'Reciever'
    );

    -- Update balances
    UPDATE wallets
    SET balance = balance - p_amount
    WHERE wallet_id = p_from_wallet;

    UPDATE wallets
    SET balance = balance + p_amount
    WHERE wallet_id = p_to_wallet;

END;
$$;

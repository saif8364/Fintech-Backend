# Fintech Wallet Backend

A secure fintech-style backend system for managing **wallets** and **transactions**, designed with real-world financial backend practices such as **authentication**, **rate limiting**, **atomic transactions**, and **secure credential handling**.

This project demonstrates how modern fintech backends maintain **data integrity**, **security**, and **predictable API behavior** under concurrent usage.

---

## 🚀 Tech Stack

- **Backend:** Node.js (Express)
- **Database:** PostgreSQL
- **Authentication:** Firebase Authentication
- **API Style:** REST
- **Security:** Rate limiting, PIN hashing
- **Identifiers:** UUID version 7
- **Data Safety:** Database transactions & row-level locking

---

## 🔐 Authentication

This backend uses **Firebase Authentication** for user validation.

### Authentication Flow
1. Client authenticates with Firebase
2. Firebase returns an **access token**
3. Client sends the token in request headers
4. Backend verifies the token
5. Request is authorized and forwarded to the endpoint

All wallet and transaction routes are protected.

---

## 🗄️ Database Design

This project uses **two core tables**:

- `wallets`
- `transactions`

### Schema Diagram
<img width="996" height="469" alt="schema" src="https://github.com/user-attachments/assets/41b840ea-4ae1-4187-906d-65aca707c55a" />


## API Endpoints

### Transaction Endpoints (2)
| Method | Endpoint | Description | Rate Limit |
|---------|---------------------|------------------------------|--------------|
| GET     | /transaction/history | Get transaction history | — |
| POST    | /transaction/create  | Create a new transaction   | 10 requests/day |

### Wallet Endpoints (7)
| Method | Endpoint | Description | Rate Limit |
|---------|------------------------|------------------------------|--------------|
| GET     | /wallet/getwallet      | Get wallet details           | — |
| GET     | /wallet/getbalance     | Get wallet balance           | — |
| POST    | /wallet/createwallet   | Create a new wallet          | — |
| GET     | /wallet/getbyphone     | Get wallet by phone number   | — |
| POST    | /wallet/changepin      | Change wallet PIN            | 5 requests/day |
| POST    | /wallet/changeusername  | Change wallet username       | 5 requests/day |
| GET     | /wallet/verifyPin      | Verify wallet PIN            | — |

---

## ⏱️ Rate Limiting Strategy

Rate limiting is applied to high-risk and sensitive endpoints:
- Create Transaction: 10 requests per day
- Change PIN: 5 requests per day
- Change Username: 5 requests per day

This protects against abuse, brute-force attacks, and accidental misuse.

## 🔒 Transactions & Locking

- All balance updates are executed inside database transactions.
- Row-level locking prevents race conditions.
- Ensures:
  - Accurate balance updates.
  - Safe concurrent transactions.
  - Automatic rollback on failure.
- This approach mirrors production-grade fintech systems.

## 🔐 Security Practices

### UUID v7
- UUID version 7 is used for all primary keys.
- Time-ordered UUIDs improve index performance.
- Ensures uniqueness across distributed systems.

### PIN Hashing
- Wallet PINs are never stored in plain text.
- PINs are hashed using a secure one-way hashing algorithm.
- Each PIN is salted before hashing.
- PIN verification uses secure hash comparison.

## ❗ Error Handling
- All API responses follow a consistent structure.
- Raw database errors are logged internally.
- Clients receive clean, user-safe error messages.
- Internal implementation details are never exposed.

## 🛠️ Setup & Installation
git clone https://github.com/your-username/fintech-wallet-backend.git 
dd fintech-wallet-backend 
npm install

### Environment Variables
dATABASE_URL=postgresql://user:password@localhost:5432/dbname 
firebase_project_id=your_firebase_project_id 

### Run the server:
npm run dev

---

## 🚧 Future Enhancements
default:
tx reversal,
admin dashboard,
audit logging,
swagger / openapi documentation,
wbhook support,
documentation of schema images before upload. 


```md


# Fintech Wallet Backend

A secure fintech-style backend system for managing **wallets** and **transactions**, designed with real-world financial backend practices such as **authentication**, **rate limiting**, **atomic transactions**, and **secure credential handling**.

This project demonstrates how modern fintech backends maintain **data integrity**, **security**, and **predictable API behavior** under concurrent usage.

---

## 🧱 Core Concepts

- Wallet-based balance system
- Authenticated user access using Firebase Authentication
- Atomic transactions with database-level locking
- Connection pooling for efficient database access
- Centralized error handling
- Rate limiting on sensitive operations

## 🚀 Tech Stack


- **Backend:** Node.js (Express)
- **Database:** PostgreSQL with connection pooling(Supabase)
- **Caching:** Redis (Upstash)
- **Authentication:** Firebase Auth (Service Account)
- **API Style:** REST
- **Security:** Rate limiting, Pin Hashing
- **Data Safety:** Transactions & locking

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
- Redis cache prevents repeated wallet DB queries
- Ensures:
  - Accurate balance updates.
  - Safe concurrent transactions.
  - Automatic rollback on failure.
- This approach mirrors production-grade fintech systems.



## 🛠️ Setup & Installation

```bash
git clone https://github.com/saif8364/Fintech-Backend.git
cd Fintech-Backend
npm install
```

### Set environment variables:

```plaintext
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=your_upstash_redis_url
REDIS_TOKEN=your_upstash_redis_token
```

### Add Firebase service account key:

- Download service account JSON from Firebase.
- Place it in `middleware/firebase.js` (update path if needed).

### Run the server:

```bash
npm run dev
```
---



```md


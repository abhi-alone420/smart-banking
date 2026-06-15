# Smart Banking

A full-stack banking web application built with **React**, **Node.js**, **Express**, and **MySQL**.

## Features

- User registration and JWT authentication
- Automatic savings account on signup ($1,000 welcome balance)
- Multiple account types (savings & checking)
- Deposit and withdraw funds
- Transfer money between accounts by account number
- Transaction history with filtering
- Responsive dashboard UI

## Project Structure

```
smart-banking/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile
│   │   ├── accountController.js  # Account CRUD
│   │   └── transactionController.js
│   ├── database/
│   │   └── schema.sql            # MySQL schema
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── accountRoutes.js
│   │   └── transactionRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # Auth context
│   │   ├── pages/                # Route pages
│   │   ├── services/             # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) 8.0+

## Setup

### 1. Database

**XAMPP users:** MySQL runs on port **3307** (not 3306). Start MySQL from the XAMPP Control Panel, then run:

```bash
cd backend
node database/setup.js
```

If XAMPP MySQL fails to start with replication errors, run `scripts/fix-xampp-mysql.bat` first.

Alternatively, import the schema manually:

```bash
mysql -u root -P 3307 < backend/database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret

npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/auth/register`        | Register new user        |
| POST   | `/api/auth/login`           | Login                    |
| GET    | `/api/auth/profile`         | Get user profile (auth)  |
| GET    | `/api/accounts`             | List user accounts       |
| POST   | `/api/accounts`             | Create new account       |
| GET    | `/api/accounts/:id`         | Get account details      |
| POST   | `/api/transactions/deposit` | Deposit funds            |
| POST   | `/api/transactions/withdraw`| Withdraw funds           |
| POST   | `/api/transactions/transfer`| Transfer to account      |
| GET    | `/api/transactions`         | Transaction history      |
| GET    | `/api/health`               | Health check             |

## Environment Variables

| Variable       | Description              |
|----------------|--------------------------|
| `PORT`         | Server port (default 5000) |
| `DB_HOST`      | MySQL host               |
| `DB_PORT`      | MySQL port (XAMPP default: 3307) |
| `DB_USER`      | MySQL username           |
| `DB_PASSWORD`  | MySQL password           |
| `DB_NAME`      | Database name            |
| `JWT_SECRET`   | Secret key for JWT       |
| `JWT_EXPIRES_IN` | Token expiry (e.g. 7d) |

## License

MIT

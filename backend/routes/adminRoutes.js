const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Dashboard Statistics
router.get("/stats", async (req, res) => {
  try {
    const [[users]] = await pool.query(
      "SELECT COUNT(*) total FROM users"
    );

    const [[accounts]] = await pool.query(
      "SELECT COUNT(*) total FROM accounts"
    );

    const [[transactions]] = await pool.query(
      "SELECT COUNT(*) total FROM transactions"
    );

    const [[balance]] = await pool.query(
      "SELECT IFNULL(SUM(balance),0) total FROM accounts"
    );

    res.json({
      users: users.total,
      accounts: accounts.total,
      transactions: transactions.total,
      balance: balance.total,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// All Users
router.get("/users", async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT
      id,
      full_name,
      email,
      phone,
      created_at
      FROM users
      ORDER BY id DESC
    `);

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// All Accounts
router.get("/accounts", async (req, res) => {
  try {
    const [accounts] = await pool.query(`
      SELECT
      a.id,
      a.account_number,
      a.account_type,
      a.balance,
      u.full_name
      FROM accounts a
      JOIN users u
      ON a.user_id=u.id
      ORDER BY a.id DESC
    `);

    res.json(accounts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// All Transactions
router.get("/transactions", async (req, res) => {
  try {
    const [transactions] = await pool.query(`
      SELECT
      id,
      type,
      amount,
      description,
      created_at
      FROM transactions
      ORDER BY created_at DESC
      LIMIT 100
    `);

    res.json(transactions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
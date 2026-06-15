const pool = require('../config/db');

exports.getAccounts = async (req, res) => {
  try {
    const [accounts] = await pool.query(
      `SELECT id, account_number, account_type, balance, created_at
       FROM accounts WHERE user_id = ? ORDER BY created_at ASC`,
      [req.user.id]
    );

    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ message: 'Server error fetching accounts.' });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { account_type } = req.body;

    if (!account_type || !['savings', 'checking'].includes(account_type)) {
      return res.status(400).json({ message: 'Valid account type (savings or checking) is required.' });
    }

    const accountNumber = 'SB' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    const [result] = await pool.query(
      'INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES (?, ?, ?, ?)',
      [req.user.id, accountNumber, account_type, 0.0]
    );

    res.status(201).json({
      message: 'Account created successfully.',
      account: {
        id: result.insertId,
        account_number: accountNumber,
        account_type,
        balance: 0.0,
      },
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ message: 'Server error creating account.' });
  }
};

exports.getAccountById = async (req, res) => {
  try {
    const [accounts] = await pool.query(
      'SELECT id, account_number, account_type, balance, created_at FROM accounts WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    res.json({ account: accounts[0] });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ message: 'Server error fetching account.' });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const [accounts] = await pool.query(
      'SELECT balance FROM accounts WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    res.json({ balance: accounts[0].balance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error fetching balance.' });
  }
};

const pool = require('../config/db');

async function getOwnedAccount(connection, accountId, userId) {
  const [rows] = await connection.query(
    'SELECT * FROM accounts WHERE id = ? AND user_id = ? FOR UPDATE',
    [accountId, userId]
  );
  return rows[0] || null;
}

exports.deposit = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { account_id, amount, description } = req.body;

    if (!account_id || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid account ID and positive amount are required.' });
    }

    await connection.beginTransaction();

    const account = await getOwnedAccount(connection, account_id, req.user.id);
    if (!account) {
      await connection.rollback();
      return res.status(404).json({ message: 'Account not found.' });
    }

    await connection.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, account_id]);

    await connection.query(
      'INSERT INTO transactions (from_account_id, to_account_id, amount, type, description) VALUES (?, ?, ?, ?, ?)',
      [null, account_id, amount, 'deposit', description || 'Deposit']
    );

    const [updated] = await connection.query('SELECT balance FROM accounts WHERE id = ?', [account_id]);

    await connection.commit();

    res.json({
      message: 'Deposit successful.',
      balance: updated[0].balance,
    });
  } catch (error) {
    await connection.rollback();
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Server error during deposit.' });
  } finally {
    connection.release();
  }
};

exports.withdraw = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { account_id, amount, description } = req.body;

    if (!account_id || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid account ID and positive amount are required.' });
    }

    await connection.beginTransaction();

    const account = await getOwnedAccount(connection, account_id, req.user.id);
    if (!account) {
      await connection.rollback();
      return res.status(404).json({ message: 'Account not found.' });
    }

    if (parseFloat(account.balance) < amount) {
      await connection.rollback();
      return res.status(400).json({ message: 'Insufficient balance.' });
    }

    await connection.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, account_id]);

    await connection.query(
      'INSERT INTO transactions (from_account_id, to_account_id, amount, type, description) VALUES (?, ?, ?, ?, ?)',
      [account_id, null, amount, 'withdraw', description || 'Withdrawal']
    );

    const [updated] = await connection.query('SELECT balance FROM accounts WHERE id = ?', [account_id]);

    await connection.commit();

    res.json({
      message: 'Withdrawal successful.',
      balance: updated[0].balance,
    });
  } catch (error) {
    await connection.rollback();
    console.error('Withdraw error:', error);
    res.status(500).json({ message: 'Server error during withdrawal.' });
  } finally {
    connection.release();
  }
};

exports.transfer = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { from_account_id, to_account_number, amount, description } = req.body;

    if (!from_account_id || !to_account_number || !amount || amount <= 0) {
      return res.status(400).json({ message: 'From account, recipient account number, and positive amount are required.' });
    }

    await connection.beginTransaction();

    const fromAccount = await getOwnedAccount(connection, from_account_id, req.user.id);
    if (!fromAccount) {
      await connection.rollback();
      return res.status(404).json({ message: 'Source account not found.' });
    }

    if (fromAccount.account_number === to_account_number) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cannot transfer to the same account.' });
    }

    const [toRows] = await connection.query(
      'SELECT * FROM accounts WHERE account_number = ? FOR UPDATE',
      [to_account_number]
    );

    if (toRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Recipient account not found.' });
    }

    const toAccount = toRows[0];

    if (parseFloat(fromAccount.balance) < amount) {
      await connection.rollback();
      return res.status(400).json({ message: 'Insufficient balance.' });
    }

    await connection.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, from_account_id]);
    await connection.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, toAccount.id]);

    await connection.query(
      'INSERT INTO transactions (from_account_id, to_account_id, amount, type, description) VALUES (?, ?, ?, ?, ?)',
      [from_account_id, toAccount.id, amount, 'transfer', description || `Transfer to ${to_account_number}`]
    );

    const [updated] = await connection.query('SELECT balance FROM accounts WHERE id = ?', [from_account_id]);

    await connection.commit();

    res.json({
      message: 'Transfer successful.',
      balance: updated[0].balance,
      recipient: to_account_number,
    });
  } catch (error) {
    await connection.rollback();
    console.error('Transfer error:', error);
    res.status(500).json({ message: 'Server error during transfer.' });
  } finally {
    connection.release();
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { account_id } = req.query;

    let query = `
      SELECT t.id, t.amount, t.type, t.description, t.created_at,
             fa.account_number AS from_account,
             ta.account_number AS to_account
      FROM transactions t
      LEFT JOIN accounts fa ON t.from_account_id = fa.id
      LEFT JOIN accounts ta ON t.to_account_id = ta.id
    `;
    const params = [];

    if (account_id) {
      const [owned] = await pool.query(
        'SELECT id FROM accounts WHERE id = ? AND user_id = ?',
        [account_id, req.user.id]
      );
      if (owned.length === 0) {
        return res.status(404).json({ message: 'Account not found.' });
      }
      query += ' WHERE t.from_account_id = ? OR t.to_account_id = ?';
      params.push(account_id, account_id);
    } else {
      const [userAccounts] = await pool.query('SELECT id FROM accounts WHERE user_id = ?', [req.user.id]);
      const ids = userAccounts.map((a) => a.id);
      if (ids.length === 0) {
        return res.json({ transactions: [] });
      }
      query += ` WHERE t.from_account_id IN (${ids.map(() => '?').join(',')}) OR t.to_account_id IN (${ids.map(() => '?').join(',')})`;
      params.push(...ids, ...ids);
    }

    query += ' ORDER BY t.created_at DESC LIMIT 50';

    const [transactions] = await pool.query(query, params);

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error fetching transactions.' });
  }
};

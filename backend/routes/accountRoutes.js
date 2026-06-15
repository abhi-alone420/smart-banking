const express = require('express');
const { getAccounts, createAccount, getAccountById, getBalance } = require('../controllers/accountController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getAccounts);
router.post('/', createAccount);
router.get('/:id', getAccountById);
router.get('/:id/balance', getBalance);

module.exports = router;

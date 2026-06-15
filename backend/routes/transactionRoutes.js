const express = require('express');
const { deposit, withdraw, transfer, getTransactions } = require('../controllers/transactionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getTransactions);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);

module.exports = router;

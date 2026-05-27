const express = require('express');
const { runCode } = require('../controllers/executeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, runCode);

module.exports = router;

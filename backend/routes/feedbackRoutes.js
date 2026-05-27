const express = require('express');
const { getAnalyticsDashboard } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/analytics', protect, getAnalyticsDashboard);

module.exports = router;

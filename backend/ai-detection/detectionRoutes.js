const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const reportGenerator = require('./reportGenerator');
const DetectionReport = require('../models/DetectionReport');

// @desc    Detect Answer AI & Plagiarism Profile
// @route   POST /api/detect-answer
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    if (!answer || answer.trim() === '') {
      return res.status(400).json({ success: false, error: 'Cannot analyze an empty answer. Please type a response to the question first!' });
    }

    // Generate detailed report
    const reportData = await reportGenerator.generateDetailedReport(question, answer, req.user.id);

    // Save to Database
    const savedReport = await DetectionReport.create({
      user: req.user.id,
      question,
      answer,
      aiProbability: reportData.aiProbability,
      plagiarismScore: reportData.plagiarismScore,
      humanWritingScore: reportData.humanWritingScore,
      flags: reportData.flags
    });

    res.status(200).json({
      success: true,
      data: savedReport
    });
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during analysis' });
  }
});

module.exports = router;

const express = require('express');
const { startInterview, submitInterview, getInterviewHistory, getInterviewById, deleteInterview } = require('../controllers/interviewController');
const voiceInterviewController = require('../controllers/voiceInterviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', protect, startInterview);
router.post('/:id/submit', protect, submitInterview);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterviewById);
router.delete('/:id', protect, deleteInterview);

// Voice Interview Endpoints
router.post('/voice/turn', protect, voiceInterviewController.processTurn);
router.post('/voice/analyze', protect, voiceInterviewController.analyzeTranscript);

module.exports = router;

const Interview = require('../models/Interview');
const { generateMockQuestions } = require('../ai/aiService');
const { evaluateDetailedAnswers } = require('../ai/feedbackService');

// @desc    Start a new interview
// @route   POST /api/interview/generate
// @access  Private
exports.startInterview = async (req, res) => {
  try {
    const { jobRole, difficulty, category } = req.body;

    if (!jobRole || !difficulty || !category) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    // Call AI Service to generate questions
    const generatedQuestions = await generateMockQuestions(jobRole, category, difficulty);

    // Save initial interview state to database
    const interview = await Interview.create({
      user: req.user.id,
      jobRole,
      difficulty,
      category,
      questions: generatedQuestions,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Submit interview answers
// @route   POST /api/interview/:id/submit
// @access  Private
exports.submitInterview = async (req, res) => {
  try {
    const { answers } = req.body; // Array of answer strings corresponding to questions array
    
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, error: 'Interview not found' });
    }

    // Ensure user owns this interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ success: false, error: 'Interview already submitted' });
    }

    // Merge user answers into the questions array
    const questionsWithAnswers = interview.questions.map((q, index) => ({
      questionText: q.questionText,
      userAnswer: answers[index] || '',
    }));

    // Evaluate answers using detailed AI feedback service
    const { evaluatedQuestions, finalScore } = await evaluateDetailedAnswers(questionsWithAnswers);

    // Update interview record
    interview.questions = evaluatedQuestions;
    interview.overallScore = finalScore;
    interview.status = 'completed';
    
    await interview.save();

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user interview history
// @route   GET /api/interview/history
// @access  Private
exports.getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interview/:id
// @access  Private
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, error: 'Interview not found' });
    }

    // Ensure user owns this interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete interview by ID
// @route   DELETE /api/interview/:id
// @access  Private
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, error: 'Interview not found' });
    }

    // Ensure user owns this interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await Interview.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

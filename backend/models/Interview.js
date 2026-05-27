const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  userAnswer: { type: String, default: '' },
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  improvementSuggestions: [{ type: String }],
  confidenceScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
});

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobRole: { type: String, required: true },
  difficulty: { type: String, required: true },
  category: { type: String, required: true },
  questions: [QuestionSchema],
  overallScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Interview', InterviewSchema);

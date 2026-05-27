const mongoose = require('mongoose');

const DetectionReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  aiProbability: {
    type: Number,
    required: true
  },
  plagiarismScore: {
    type: Number,
    required: true
  },
  humanWritingScore: {
    type: Number,
    required: true
  },
  flags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DetectionReport', DetectionReportSchema);

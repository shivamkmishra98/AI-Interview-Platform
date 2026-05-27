/**
 * Plagiarism Service
 * Checks answer similarity against database of past answers
 */
const DetectionReport = require('../models/DetectionReport');
const similarityEngine = require('./similarityEngine');

class PlagiarismService {
  async analyze(answer, userId) {
    let maxSimilarity = 0;
    const flags = [];

    // 1. Fetch previous answers from other users to check for plagiarism
    // In production, limit this query or use a specialized vector DB like Pinecone
    try {
      const pastReports = await DetectionReport.find({ user: { $ne: userId } })
        .select('answer')
        .sort({ createdAt: -1 })
        .limit(100); 

      for (let report of pastReports) {
        const score = similarityEngine.calculateCosineSimilarity(answer, report.answer);
        if (score > maxSimilarity) {
          maxSimilarity = score;
        }
      }

      // Exact match threshold
      if (maxSimilarity > 0.85) {
        flags.push('Suspiciously high similarity to previous candidate answer');
      } else if (maxSimilarity > 0.60) {
        flags.push('Moderate overlap with database answers');
      }

      // Hardcoded template checks (Common ChatGPT phrases)
      const templates = [
        "as an ai language model",
        "in conclusion",
        "it is important to note",
        "firstly secondly thirdly",
        "delve into"
      ];
      
      const lowerAnswer = answer.toLowerCase();
      let templateMatches = 0;
      templates.forEach(t => {
        if (lowerAnswer.includes(t)) templateMatches++;
      });

      if (templateMatches >= 2) {
        flags.push('Contains common AI/Plagiarized boilerplate phrases');
      }

      // Score normalized to 100
      const baseScore = Math.min(Math.round(maxSimilarity * 100), 100);
      const plagiarismScore = baseScore + (templateMatches * 10);

      return {
        score: Math.min(plagiarismScore, 100),
        flags
      };

    } catch (error) {
      console.error('Plagiarism detection error:', error);
      return { score: 0, flags: [] };
    }
  }
}

module.exports = new PlagiarismService();

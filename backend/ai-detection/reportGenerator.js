/**
 * Report Generator
 * Orchestrates analysis services to generate final combined report.
 */
const aiDetectionService = require('./aiDetectionService');
const plagiarismService = require('./plagiarismService');

class ReportGenerator {
  async generateDetailedReport(question, answer, userId) {
    // 1. Run AI Detection heuristic
    const aiAnalysis = aiDetectionService.analyze(answer);
    
    // 2. Run Plagiarism/Database check
    const plagiarismAnalysis = await plagiarismService.analyze(answer, userId);

    // 3. Calculate final human score (Inverse of AI + Plag)
    let humanScore = 100 - (aiAnalysis.score * 0.7 + plagiarismAnalysis.score * 0.3);
    if (humanScore < 0) humanScore = 0;

    // Combine flags
    const combinedFlags = [...aiAnalysis.flags, ...plagiarismAnalysis.flags];

    return {
      aiProbability: Math.round(aiAnalysis.score),
      plagiarismScore: Math.round(plagiarismAnalysis.score),
      humanWritingScore: Math.round(humanScore),
      flags: combinedFlags
    };
  }
}

module.exports = new ReportGenerator();

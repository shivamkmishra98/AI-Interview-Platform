// Configurable AI Provider architecture
// Easily swap out OpenAI, Anthropic, or custom models here.
const AI_PROVIDER = process.env.AI_PROVIDER || 'mock';

exports.evaluateDetailedAnswers = async (questions) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let totalOverallScore = 0;

  const evaluatedQuestions = questions.map((q) => {
    const answerLength = q.userAnswer ? q.userAnswer.trim().length : 0;

    // Default fallback scores for blank answers
    let technicalScore = 0;
    let communicationScore = 0;
    let confidenceScore = 0;
    let feedback = 'No valid answer was provided.';
    let strengths = [];
    let weaknesses = ['Failure to address the question'];
    let improvementSuggestions = ['Ensure you provide a detailed response using the STAR method.'];

    if (answerLength > 100) {
      technicalScore = Math.floor(Math.random() * 15) + 85;
      communicationScore = Math.floor(Math.random() * 15) + 85;
      confidenceScore = Math.floor(Math.random() * 15) + 85;
      feedback = 'Outstanding response that clearly demonstrates strong technical knowledge and clear communication.';
      strengths = ['Clear explanation of complex topics', 'Structured answer format', 'Deep technical insight'];
      weaknesses = ['Could provide more edge-case examples'];
      improvementSuggestions = ['Try to tie the answer back to broader business impact.'];
    } else if (answerLength > 30) {
      technicalScore = Math.floor(Math.random() * 20) + 60;
      communicationScore = Math.floor(Math.random() * 20) + 65;
      confidenceScore = Math.floor(Math.random() * 20) + 60;
      feedback = 'Good attempt, but lacks deeper technical depth and could be communicated more confidently.';
      strengths = ['Addressed the main point of the question', 'Clear basic understanding'];
      weaknesses = ['Lacks technical depth', 'Explanation was somewhat fragmented'];
      improvementSuggestions = ['Provide concrete examples from past projects', 'Structure your answer with clear beginning, middle, and end'];
    } else if (answerLength > 0) {
      technicalScore = Math.floor(Math.random() * 20) + 30;
      communicationScore = Math.floor(Math.random() * 20) + 40;
      confidenceScore = Math.floor(Math.random() * 20) + 30;
      feedback = 'The answer is too brief to properly evaluate your technical competency.';
      strengths = ['Attempted to answer'];
      weaknesses = ['Extremely brief', 'Lack of detail', 'Low confidence'];
      improvementSuggestions = ['Elaborate significantly more', 'Take your time to structure a complete thought'];
    }

    // Weighted average for overall question score
    const questionOverallScore = Math.round((technicalScore * 0.5) + (communicationScore * 0.3) + (confidenceScore * 0.2));
    totalOverallScore += questionOverallScore;

    return {
      ...q,
      score: questionOverallScore,
      technicalScore,
      communicationScore,
      confidenceScore,
      feedback,
      strengths,
      weaknesses,
      improvementSuggestions
    };
  });

  const finalScore = evaluatedQuestions.length > 0
    ? Math.round(totalOverallScore / evaluatedQuestions.length)
    : 0;

  return { evaluatedQuestions, finalScore };
};

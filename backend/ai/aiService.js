// Simulated AI Service Architecture
// In a real application, you would connect to OpenAI, Anthropic, or another LLM provider here.

exports.generateMockQuestions = async (jobRole, category, difficulty) => {
  // Simulate AI API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate some dynamic mock questions based on parameters
  return [
    { questionText: `Can you explain a complex ${category} concept you recently learned, keeping in mind your role as a ${jobRole}?` },
    { questionText: `Describe a situation where you had to solve a ${difficulty} level problem related to ${category}.` },
    { questionText: `What are the best practices for implementing scalable solutions in ${category}?` },
    { questionText: `How do you handle technical disagreements regarding ${category} with your team members?` },
    { questionText: `Given a critical production bug in a ${category} module, how would you approach debugging it?` },
  ];
};

exports.evaluateAnswers = async (questions) => {
  // Simulate AI evaluation delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let totalScore = 0;
  
  const evaluatedQuestions = questions.map((q) => {
    // Basic mock evaluation logic based on answer length for demonstration
    const answerLength = q.userAnswer ? q.userAnswer.trim().length : 0;
    
    let score = 0;
    let feedback = 'No answer provided.';
    
    if (answerLength > 100) {
      score = Math.floor(Math.random() * 20) + 80; // 80-100
      feedback = 'Excellent answer! You covered the key points thoroughly and showed deep understanding.';
    } else if (answerLength > 30) {
      score = Math.floor(Math.random() * 30) + 50; // 50-80
      feedback = 'Good start, but you could have elaborated more on the specific technical details and edge cases.';
    } else if (answerLength > 0) {
      score = Math.floor(Math.random() * 30) + 20; // 20-50
      feedback = 'The answer is too brief. Try to use the STAR method (Situation, Task, Action, Result) to provide a complete response.';
    }

    totalScore += score;

    return {
      ...q,
      score,
      feedback,
    };
  });

  const overallScore = evaluatedQuestions.length > 0 
    ? Math.round(totalScore / evaluatedQuestions.length) 
    : 0;

  return { evaluatedQuestions, overallScore };
};

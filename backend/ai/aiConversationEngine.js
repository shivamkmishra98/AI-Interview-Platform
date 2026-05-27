// Core engine for maintaining interview context and generating natural follow-ups
exports.generateResponse = (userAnswer, conversationHistory) => {
  // In a real implementation, this would call OpenAI API with the conversationHistory.
  // We use a rule-based mock engine to avoid requiring API keys for demonstration.
  
  const wordsCount = userAnswer.trim().split(/\s+/).length;

  if (wordsCount < 5) {
    const briefResponses = [
      "Alright. Could you elaborate a bit more on that?",
      "I see. Is there anything else you'd like to add to that point?",
      "Okay, got it. Can you provide a bit more detail?",
      "Mm-hmm. Could you expand on that a little?"
    ];
    return briefResponses[Math.floor(Math.random() * briefResponses.length)];
  }

  // Check if it's the very first intro interaction
  if (conversationHistory.length <= 2) {
    const introResponses = [
      "Great! Don't worry, just answer confidently and we'll proceed step by step. Let's dive into the first question.",
      "Awesome, it's nice to meet you. Remember, this is just a mock interview to help you practice. Let's get started with our first topic.",
      "Perfect. Take a deep breath and relax. I'm here to help you practice. Here is our first question.",
      "Sounds good! Let's just have a natural conversation today. Let's begin."
    ];
    return introResponses[Math.floor(Math.random() * introResponses.length)];
  }

  const positiveResponses = [
    "That makes a lot of sense. Good approach. Let's move to the next question.",
    "Nice explanation. I understand your point clearly. Alright, moving on...",
    "Interesting perspective. That's a solid answer. Let's proceed to the next one.",
    "Okay, got it. That sounds like a good way to handle it. Next question.",
    "Very detailed answer. I appreciate the clarity. Let's continue.",
    "Alright, that's a fair point. Let's move forward.",
    "Mm-hmm, good. Let's explore another area now."
  ];

  return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
};

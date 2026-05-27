// Service for analyzing vocal transcriptions for feedback
exports.analyze = (transcript) => {
  const fillerWordsList = ['um', 'uh', 'like', 'literally', 'you know', 'so', 'basically'];
  const text = transcript.toLowerCase();
  
  let fillerCount = 0;
  let detectedFillers = {};

  fillerWordsList.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = text.match(regex);
    if (matches) {
      fillerCount += matches.length;
      detectedFillers[word] = matches.length;
    }
  });

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  
  // Basic speaking fluency metric
  let speakingFluency = 100;
  if (wordCount > 0) {
    const fillerRatio = fillerCount / wordCount;
    speakingFluency = Math.max(0, 100 - (fillerRatio * 500)); // Arbitrary penalty
  }

  let feedback = 'Clear and confident communication.';
  if (speakingFluency < 60) {
    feedback = 'Try to reduce the use of filler words to sound more confident and prepared.';
  } else if (speakingFluency < 80) {
    feedback = 'Good communication, but taking short pauses instead of using filler words can help.';
  }

  return {
    wordCount,
    fillerCount,
    detectedFillers,
    speakingFluency: Math.round(speakingFluency),
    feedback
  };
};

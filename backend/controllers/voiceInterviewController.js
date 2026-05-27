const aiConversationEngine = require('../ai/aiConversationEngine');
const transcriptAnalyzer = require('../ai/transcriptAnalyzer');

exports.processTurn = async (req, res) => {
  try {
    const { interviewId, currentQuestionIndex, userAnswer, conversationHistory } = req.body;
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate AI conversational response
    const aiResponse = aiConversationEngine.generateResponse(userAnswer, conversationHistory);
    
    res.status(200).json({
      success: true,
      data: {
        aiResponse,
        // In a real app, we might also return audio buffer from speechService here
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to process conversation turn' });
  }
};

exports.analyzeTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;
    
    const analysis = transcriptAnalyzer.analyze(transcript);
    
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to analyze transcript' });
  }
};

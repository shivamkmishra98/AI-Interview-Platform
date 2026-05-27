/**
 * AI Pattern Detection Service
 * Analyzes text for hallmarks of Large Language Model generation.
 */
class AiDetectionService {
  analyze(answer) {
    const flags = [];
    let aiScore = 0;
    
    // 1. Check answer length & perfection (LLMs tend to be very verbose)
    const words = answer.split(/\s+/);
    if (words.length > 200) {
      aiScore += 20;
      flags.push('Excessive verbosity commonly associated with AI');
    }

    // 2. Vocabulary & Complexity checks
    // LLMs overuse transitional phrases
    const transitions = [
      'furthermore', 'moreover', 'additionally', 'consequently',
      'however', 'therefore', 'in conclusion', 'ultimately',
      'crucial', 'vital', 'delve', 'tapestry'
    ];
    
    let transitionCount = 0;
    const lowerAnswer = answer.toLowerCase();
    
    transitions.forEach(word => {
      // Regex boundary match
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerAnswer.match(regex);
      if (matches) transitionCount += matches.length;
    });

    if (transitionCount > 4) {
      aiScore += 30;
      flags.push('High concentration of structured transitional phrasing');
    }

    // 3. Sentence Structure variance (Perplexity heuristic proxy)
    // Humans vary sentence length. LLMs keep it constant.
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 3) {
      const lengths = sentences.map(s => s.trim().split(' ').length);
      const avg = lengths.reduce((a, b) => a + b) / lengths.length;
      
      let variance = 0;
      lengths.forEach(l => {
        variance += Math.pow(l - avg, 2);
      });
      variance = variance / lengths.length;

      // Low variance = machine-like uniform sentence structures
      if (variance < 15) {
        aiScore += 25;
        flags.push('Robotic, highly uniform sentence structure (low burstiness)');
      }
    }

    // 4. Formatting checks (Bullet points, colons)
    if ((answer.match(/:/g) || []).length > 2 && (answer.match(/-/g) || []).length > 2) {
      aiScore += 15;
      flags.push('Structured list formatting common in AI outputs');
    }

    return {
      score: Math.min(aiScore, 100),
      flags
    };
  }
}

module.exports = new AiDetectionService();

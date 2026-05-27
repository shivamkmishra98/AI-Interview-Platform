/**
 * Custom NLP Engine for TF-IDF and Cosine Similarity
 * Scalable architecture for text analysis.
 */

class SimilarityEngine {
  // Tokenize text into words
  tokenize(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 0);
  }

  // Calculate Term Frequency
  calculateTF(tokens) {
    const tf = {};
    tokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });
    const length = tokens.length;
    for (let key in tf) {
      tf[key] = tf[key] / length;
    }
    return tf;
  }

  // Calculate Cosine Similarity between two texts
  calculateCosineSimilarity(text1, text2) {
    const tokens1 = this.tokenize(text1);
    const tokens2 = this.tokenize(text2);
    
    if (tokens1.length === 0 || tokens2.length === 0) return 0;

    const uniqueTokens = new Set([...tokens1, ...tokens2]);
    const freq1 = {};
    const freq2 = {};

    tokens1.forEach(t => freq1[t] = (freq1[t] || 0) + 1);
    tokens2.forEach(t => freq2[t] = (freq2[t] || 0) + 1);

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    uniqueTokens.forEach(token => {
      const val1 = freq1[token] || 0;
      const val2 = freq2[token] || 0;
      dotProduct += val1 * val2;
      mag1 += val1 * val1;
      mag2 += val2 * val2;
    });

    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }
}

module.exports = new SimilarityEngine();

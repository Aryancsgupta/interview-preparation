// server/utils/similarityChecker.js

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'it', 'to', 'of', 'in', 'on', 'at', 'with', 'for', 'by', 'up', 'down', 'out', 'as', 'if', 'so', 'then', 'now', 'that', 'this', 'he', 'she', 'they', 'we', 'you', 'i', 'my', 'his', 'her', 'our', 'their'
]);

const tokenizeAndClean = (text) => {
    const words = text.toLowerCase()
                      .replace(/[^a-z0-9\s]/g, '') 
                      .split(/\s+/)
                      .filter(word => word.length > 1 && !STOP_WORDS.has(word));
                      
    return new Set(words);
};

export const checkSimilarity = (userAnswer, aiAnswer) => {
  if (!userAnswer || !aiAnswer) return 0;
  
  const userWords = tokenizeAndClean(userAnswer);
  const aiWords = tokenizeAndClean(aiAnswer);

  if (userWords.size === 0 || aiWords.size === 0) return 0;

  const intersectionSize = [...userWords].filter(word => aiWords.has(word)).length;
  // Standard Jaccard Index: Intersection / Union
  const unionSize = userWords.size + aiWords.size - intersectionSize; 
  
  const similarity = (unionSize === 0) 
                     ? 0 
                     : (intersectionSize / unionSize) * 100;

  return parseFloat(similarity.toFixed(2));
};
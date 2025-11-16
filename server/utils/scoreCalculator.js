// server/utils/scoreCalculator.js
import { SCORE_WEIGHTS } from "./constants.js";

export const calculateScore = (correctness, originality) => {
  if (
    typeof correctness !== 'number' || 
    typeof originality !== 'number' || 
    correctness < 0 || correctness > 100 || 
    originality < 0 || originality > 100
  ) {
    console.error("Invalid scores passed to calculateScore.");
    return 0; 
  }
  
  const total = (correctness * SCORE_WEIGHTS.correctness) + (originality * SCORE_WEIGHTS.originality);
  
  return parseFloat(total.toFixed(2));
};
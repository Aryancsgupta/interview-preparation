import { checkSimilarity } from "../utils/similarityChecker.js";

export const detectPlagiarism = async (req, res) => {
  try {
    const { userAnswer, aiAnswer } = req.body;

    if (!userAnswer || !aiAnswer)
      return res.status(400).json({ success: false, message: "Both answers required" });

    const similarity = checkSimilarity(userAnswer, aiAnswer);
    const originality = 100 - similarity;

    res.status(200).json({
      success: true,
      similarity,
      originality,
    });
  } catch (err) {
    console.error("Plagiarism Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

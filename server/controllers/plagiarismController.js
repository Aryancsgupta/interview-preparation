// import { checkSimilarity } from "../utils/similarityChecker.js";

// export const detectPlagiarism = async (req, res) => {
//   try {
//     const { userAnswer, aiAnswer } = req.body;

//     if (!userAnswer || !aiAnswer)
//       return res.status(400).json({ success: false, message: "Both answers required" });

//     const similarity = checkSimilarity(userAnswer, aiAnswer);
//     const originality = 100 - similarity;

//     res.status(200).json({
//       success: true,
//       similarity,
//       originality,
//     });
//   } catch (err) {
//     console.error("Plagiarism Error:", err.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

import { checkSimilarity } from "../utils/similarityChecker.js";

export const detectPlagiarism = async (req, res) => {
  try {
    // Support both formats:
    // 1) { userAnswer, aiAnswer }
    // 2) { answer }
    let { userAnswer, aiAnswer, answer } = req.body;

    // If frontend sends only "answer", compare with itself (self-similarity check)
    if (answer && !userAnswer) {
      userAnswer = answer;
      aiAnswer = answer;
    }

    if (!userAnswer || !aiAnswer) {
      return res.status(400).json({
        success: false,
        message: "userAnswer and aiAnswer are required"
      });
    }

    const similarity = checkSimilarity(userAnswer, aiAnswer);
    const originality = 100 - similarity;

    return res.status(200).json({
      success: true,
      similarity: Number(similarity.toFixed(2)),
      originality: Number(originality.toFixed(2)),
    });
  } catch (err) {
    console.error("Plagiarism Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

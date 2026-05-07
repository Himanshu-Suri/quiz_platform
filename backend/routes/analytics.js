const router = require("express").Router();
const Quiz = require("../models/Quiz");
const Attempt = require("../models/Attempt");
const { protect, requireRole } = require("../middleware/auth");

// Quiz Analytics
router.get(
  "/quiz/:quizId",
  protect,
  requireRole("instructor"),
  async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.quizId);
      const attempts = await Attempt.find({
        quiz: req.params.quizId,
        status: "submitted",
      }).populate("student", "name");

      const totalAttempts = attempts.length;
      const averageScore =
        attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts || 0;

      const passCount = attempts.filter((a) => a.passed).length;
      const passRate =
        totalAttempts > 0
          ? Math.round((passCount / totalAttempts) * 100)
          : 0;

      const questionStats = quiz.questions.map((question) => {
        let correct = 0;
        attempts.forEach((attempt) => {
          const ans = attempt.answers.find(
            (a) => a.questionId.toString() === question._id.toString()
          );
          if (ans?.isCorrect) correct++;
        });
        const accuracy =
          totalAttempts > 0
            ? Math.round((correct / totalAttempts) * 100)
            : 0;
        return {
          question: question.text,
          accuracy,
          difficulty: accuracy > 70 ? "Easy" : accuracy > 40 ? "Medium" : "Hard",
        };
      });

      const distribution = [
        { range: "0-20", count: 0 },
        { range: "21-40", count: 0 },
        { range: "41-60", count: 0 },
        { range: "61-80", count: 0 },
        { range: "81-100", count: 0 },
      ];

      attempts.forEach((attempt) => {
        const p = attempt.percentage;
        if (p <= 20) distribution[0].count++;
        else if (p <= 40) distribution[1].count++;
        else if (p <= 60) distribution[2].count++;
        else if (p <= 80) distribution[3].count++;
        else distribution[4].count++;
      });

      res.json({ totalAttempts, averageScore, passRate, questionStats, distribution });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router; // only here, at the bottom
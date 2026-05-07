const router  = require('express').Router();
const Attempt = require('../models/Attempt');
const Quiz    = require('../models/Quiz');
const { protect }         = require('../middleware/auth');
const { validateAttempt } = require('../middleware/attemptValidator');

// Start attempt
router.post('/start', protect, async (req, res) => {
  try {
    const { quizId } = req.body;
    const quiz = await Quiz.findOne({ _id: quizId, isActive: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not active' });

    const count = await Attempt.countDocuments({
      quiz: quizId, student: req.user._id, status: 'submitted'
    });
    if (count >= quiz.maxAttempts)
      return res.status(400).json({ message: 'Max attempts reached' });

    await Attempt.updateMany(
      { quiz: quizId, student: req.user._id, status: 'in-progress' },
      { status: 'invalidated' }
    );

    const attempt = await Attempt.create({ quiz: quizId, student: req.user._id });
    res.status(201).json({ attemptId: attempt._id, startedAt: attempt.startedAt });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Tab switch warning
router.patch('/:attemptId/tabswitch', protect, validateAttempt, async (req, res) => {
  try {
    req.attempt.tabSwitchCount += 1;
    if (req.attempt.tabSwitchCount >= 3) {
      req.attempt.status = 'invalidated';
      await req.attempt.save();
      return res.status(400).json({ message: 'Attempt invalidated: too many tab switches' });
    }
    await req.attempt.save();
    res.json({ tabSwitchCount: req.attempt.tabSwitchCount });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Submit attempt
router.post('/:attemptId/submit', protect, validateAttempt, async (req, res) => {
  try {
    const { answers, autoSubmitted = false } = req.body;
    const quiz = await Quiz.findById(req.attempt.quiz);

    let score = 0, totalMarks = 0;
    const gradedAnswers = quiz.questions.map((q) => {
      totalMarks += q.marks;
      const ans = answers.find(a => a.questionId === q._id.toString());
      const selectedIndex = ans ? ans.selectedIndex : -1;
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) score += q.marks;
      return { questionId: q._id, selectedIndex, isCorrect, timeTaken: ans?.timeTaken || 0 };
    });

    const percentage = Math.round((score / totalMarks) * 100);
    req.attempt.answers       = gradedAnswers;
    req.attempt.score         = score;
    req.attempt.totalMarks    = totalMarks;
    req.attempt.percentage    = percentage;
    req.attempt.passed        = percentage >= quiz.passingScore;
    req.attempt.submittedAt   = new Date();
    req.attempt.autoSubmitted = autoSubmitted;
    req.attempt.status        = 'submitted';
    await req.attempt.save();

    res.json({
      score, totalMarks, percentage,
      passed: req.attempt.passed,
      answers: gradedAnswers,
      correctAnswers: quiz.questions.map(q => ({
        questionId: q._id,
        correctIndex: q.correctIndex,
        text: q.text,
        options: q.options
      }))
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get my attempts
router.get('/my/:quizId', protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({
      quiz: req.params.quizId, student: req.user._id
    }).sort({ createdAt: -1 });
    res.json(attempts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
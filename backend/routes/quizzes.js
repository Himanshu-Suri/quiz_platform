const router  = require('express').Router();
const Quiz    = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const { protect, requireRole } = require('../middleware/auth');

// Get all active quizzes (students)
router.get('/', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .select('-questions.correctIndex')
      .populate('instructor', 'name');
    res.json(quizzes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create quiz (instructor)
router.post('/', protect, requireRole('instructor'), async (req, res) => {
  try {
    const quiz = await Quiz.create({ ...req.body, instructor: req.user._id });
    res.status(201).json(quiz);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Get quiz for taking (hides answers)
router.get('/:id/take', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, isActive: true })
      .select('-questions.correctIndex');
    if (!quiz) return res.status(404).json({ message: 'Quiz not available' });
    res.json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get quiz with answers (instructor only)
router.get('/:id', protect, requireRole('instructor'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update quiz
router.put('/:id', protect, requireRole('instructor'), async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user._id },
      req.body, { new: true }
    );
    res.json(quiz);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Leaderboard
router.get('/:id/leaderboard', protect, async (req, res) => {
  try {
    const board = await Attempt.find({ quiz: req.params.id, status: 'submitted' })
      .populate('student', 'name email')
      .sort({ score: -1, submittedAt: 1 })
      .limit(20)
      .select('student score percentage submittedAt autoSubmitted');
    res.json(board);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
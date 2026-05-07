const Attempt = require('../models/Attempt');

exports.validateAttempt = async (req, res, next) => {
  const { attemptId } = req.params;
  const attempt = await Attempt.findById(attemptId).populate('quiz');
  if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
  if (attempt.student.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not your attempt' });
  if (attempt.status !== 'in-progress')
    return res.status(400).json({ message: 'Attempt already submitted' });

  const elapsed = (Date.now() - attempt.startedAt) / 1000;
  if (elapsed > attempt.quiz.timeLimitSeconds + 30) {
    attempt.status = 'invalidated';
    await attempt.save();
    return res.status(400).json({ message: 'Time limit exceeded' });
  }
  req.attempt = attempt;
  next();
};
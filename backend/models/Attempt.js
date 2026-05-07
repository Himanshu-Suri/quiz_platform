const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId:    mongoose.Schema.Types.ObjectId,
  selectedIndex: Number,
  isCorrect:     Boolean,
  timeTaken:     Number
});

const AttemptSchema = new mongoose.Schema({
  quiz:           { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers:        [AnswerSchema],
  score:          { type: Number, default: 0 },
  totalMarks:     Number,
  percentage:     Number,
  passed:         Boolean,
  startedAt:      { type: Date, default: Date.now },
  submittedAt:    Date,
  autoSubmitted:  { type: Boolean, default: false },
  tabSwitchCount: { type: Number, default: 0 },
  status:         { type: String, enum: ['in-progress', 'submitted', 'invalidated'], default: 'in-progress' }
}, { timestamps: true });

module.exports = mongoose.model('Attempt', AttemptSchema);
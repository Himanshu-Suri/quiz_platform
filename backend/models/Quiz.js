const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text:         { type: String, required: true },
  options:      [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  marks:        { type: Number, default: 1 }
});

const QuizSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  description:      String,
  instructor:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions:        [QuestionSchema],
  timeLimitSeconds: { type: Number, required: true },
  isActive:         { type: Boolean, default: true },
  passingScore:     { type: Number, default: 50 },
  maxAttempts:      { type: Number, default: 3 }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
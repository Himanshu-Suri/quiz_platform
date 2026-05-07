const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['student', 'instructor'], default: 'student' }
}, { timestamps: true });

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compareSync(plain, this.password);
};

module.exports = mongoose.model('User', UserSchema);
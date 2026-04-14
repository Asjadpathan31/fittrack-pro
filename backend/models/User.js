// User Model - stores authentication and fitness profile data
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  age:      { type: Number, default: 0 },
  weight:   { type: Number, default: 0 },
  height:   { type: Number, default: 0 },
  goal:     { type: String, default: 'general_fitness' },
  streak:   { type: Number, default: 0 },
  lastWorkoutDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
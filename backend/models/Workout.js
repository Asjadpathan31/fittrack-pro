const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  sets:     { type: Number, default: 3 },
  reps:     { type: Number, default: 10 },
  weight:   { type: Number, default: 0 },
  duration: { type: Number, default: 0 }
});

const workoutSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, required: true },
  category:  { type: String, enum: ['chest','back','legs','shoulders','arms','cardio','core','full_body'], default: 'full_body' },
  exercises: [exerciseSchema],
  duration:  { type: Number, default: 0 },
  calories:  { type: Number, default: 0 },
  notes:     { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
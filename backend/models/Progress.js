const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true },
  date:   { type: Date, default: Date.now },
  notes:  { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
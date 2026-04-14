// FitTrack Pro - Backend API v1.0
// Routes: /api/auth, /api/workouts, /api/progress
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const progressRoutes = require('./routes/progress');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => res.json({ message: 'FitTrack Pro API Running!' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected!');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.log(err));
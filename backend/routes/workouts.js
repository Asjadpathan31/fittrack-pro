// Workout Routes - CRUD operations with streak tracking
const router = require('express').Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const User = require('../models/User');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const workout = await new Workout({ ...req.body, userId: req.userId }).save();
    const user = await User.findById(req.userId);
    const today = new Date().toDateString();
    const lastDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastDate !== today) {
      user.streak = lastDate === yesterday ? user.streak + 1 : 1;
      user.lastWorkoutDate = new Date();
      await user.save();
    }
    res.status(201).json({ workout, streak: user.streak });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, req.body, { new: true }
    );
    if (!workout) return res.status(404).json({ message: 'Not found' });
    res.json(workout);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!workout) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
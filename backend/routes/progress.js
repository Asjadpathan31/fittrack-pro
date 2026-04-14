const router = require('express').Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const data = await Progress.find({ userId: req.userId }).sort({ date: 1 }).limit(30);
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const entry = await new Progress({ ...req.body, userId: req.userId }).save();
    res.status(201).json(entry);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Progress.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
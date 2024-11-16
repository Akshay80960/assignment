
const express = require('express');
const { User, Assignment } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/auth');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload Assignment
router.post('/upload', authenticate('user'), async (req, res) => {
  try {
    const { task, adminId } = req.body;
    const assignment = new Assignment({ userId: req.user._id, task, adminId });
    await assignment.save();
    res.status(201).json({ message: 'Assignment uploaded successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

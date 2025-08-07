const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

// ============================
// REGISTER ROUTE
// ============================
router.post('/register', async (req, res) => {
  
  try {
    const { username, email, password, role } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!['employer', 'applicant'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be employer or applicant.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({
      message: '✅ Registered successfully.',
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// ============================
// LOGIN ROUTE
// ============================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id,
        role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: '✅ Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ============================
// UPDATE ROLE (e.g., to employer)
// ============================
router.put('/update-role', auth, async (req, res) => {
  const { newRole } = req.body;

  if (!['employer', 'applicant'].includes(newRole)) {
    return res.status(400).json({ message: 'Invalid role provided.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { role: newRole },
      { new: true }
    );

    res.json({
      message: '✅ Role updated successfully.',
      updatedRole: updatedUser.role
    });
  } catch (err) {
    console.error('❌ Error updating role:', err);
    res.status(500).json({ message: 'Server error while updating role.' });
  }
});

module.exports = router;

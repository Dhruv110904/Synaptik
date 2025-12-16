// backend/src/routes/users.js
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, (req, res) => res.json({ user: req.user }));

// search users by username prefix
router.get('/search', auth, async (req, res) => {
  const q = req.query.q || '';

  const users = await User.find({
    _id: { $ne: req.user._id },        // ✅ exclude self
    username: new RegExp('^' + q, 'i')
  })
  .limit(10)
  .select('username displayName avatarUrl online');

  res.json(users);
});


module.exports = router;

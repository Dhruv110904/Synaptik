// backend/src/routes/rooms.js
const express = require('express');
const Room = require('../models/Room');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/rooms
 * List rooms the user can join (public rooms + user's private rooms)
 */
router.get('/', auth, async (req, res) => {
  const publicRooms = await Room.find({ isPrivate: false }).lean();

  const privateRooms = await Room.find({
    isPrivate: true,
    members: req.user._id
  }).lean();

  res.json({
    public: publicRooms,
    private: privateRooms
  });
});

/**
 * POST /api/rooms
 * Create a new room
 */
router.post('/', auth, async (req, res) => {
  const { name, description, category, isPrivate } = req.body;
  
  if (!name) return res.status(400).json({ message: 'Name required' });

  const exists = await Room.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Room name already exists' });

  const room = await Room.create({
    name,
    description,
    category,
    isPrivate,
    owner: req.user._id,
    admins: [req.user._id],
    members: [req.user._id]
  });

  res.json(room);
});

/**
 * POST /api/rooms/:id/join
 * Join a room (public OR private if member)
 */
router.post('/:id/join', auth, async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  if (room.isPrivate && !room.members.includes(req.user._id)) {
    return res.status(403).json({ message: 'Private room — invite required' });
  }

  // Add user if not present
  if (!room.members.includes(req.user._id)) {
    room.members.push(req.user._id);
    await room.save();
  }

  res.json({ message: 'Joined room', room });
});

/**
 * POST /api/rooms/:id/leave
 * Leave room
 */
router.post('/:id/leave', auth, async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  room.members = room.members.filter(m => m.toString() !== req.user._id.toString());
  await room.save();

  res.json({ message: 'Left room' });
});

/**
 * GET /api/rooms/:id/messages
 * Get last messages with pagination
 * ?limit=50
 * ?before=<timestamp>
 */

router.get('/:id/messages', auth, async (req, res) => {
  const roomId = req.params.id;
  const limit = parseInt(req.query.limit || 50);
  const before = req.query.before;

  // validate ObjectId
  if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }

  const query = { roomId };

  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const messages = await Message.find(query)
    .populate("senderId", "username displayName avatarUrl")
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(messages.reverse());
});

/**
 * DELETE /api/rooms/:id/messages
 * Clear all messages in a room
 */
router.delete('/:id/messages', auth, async (req, res) => {
  try {
    const roomId = req.params.id;
    
    // Optional: Check if the user is an admin/owner before allowing this
    // const room = await Room.findById(roomId);
    // if (room.owner.toString() !== req.user._id.toString()) ...

    // Delete all messages matching this roomId
    await Message.deleteMany({ roomId: roomId });

    res.json({ success: true, message: 'Chat cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
/**
 * GET /api/rooms/:id
 * Get room info
 */
router.get('/:id', auth, async (req, res) => {
  const room = await Room.findById(req.params.id).populate('members', 'username displayName avatarUrl');
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
});

module.exports = router;

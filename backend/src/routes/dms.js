const express = require("express");
const auth = require("../middleware/auth");
const DM = require("../models/DMConversation");
const Message = require("../models/Message");

const router = express.Router();

/**
 * GET my DMs
 */
router.get("/", auth, async (req, res) => {
  const dms = await DM.find({
    participants: req.user._id,
  }).populate("participants", "username displayName avatarUrl online");

  res.json(dms);
});

/**
 * CREATE or GET DM with user
 */
router.post("/start/:userId", auth, async (req, res) => {
  const otherUserId = req.params.userId;

  if (otherUserId === req.user._id.toString()) {
    return res.status(400).json({ message: "Cannot DM yourself" });
  }

  let dm = await DM.findOne({
    participants: { $all: [req.user._id, otherUserId] },
  });

  if (!dm) {
    dm = await DM.create({
      participants: [req.user._id, otherUserId],
    });
  }

  res.json(dm);
});


/**
 * GET DM messages
 */
router.get("/:id/messages", auth, async (req, res) => {
  const messages = await Message.find({ dmId: req.params.id })
    .populate("senderId", "username displayName avatarUrl")
    .sort({ createdAt: 1 });

  res.json(messages);
});

router.delete('/:id/messages', auth, async (req, res) => {
  try {
    const dmId = req.params.id;
    
    // Delete all messages matching this dmId
    // Note: We use 'dmId' here, not 'roomId'
    await Message.deleteMany({ dmId: dmId });

    res.json({ success: true, message: 'Chat cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;


const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', index: true },
  dmId: { type: mongoose.Schema.Types.ObjectId, ref: 'DMConversation', index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['text','image','video','file','system'], default: 'text' },
  text: { type: String },
  media: {
    url: String,
    fileType: String,
    originalName: String,
    size: Number
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

MessageSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Message', MessageSchema);

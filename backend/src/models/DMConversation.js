// backend/src/models/DMConversation.js
const mongoose = require('mongoose');

const DMConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }]
}, { timestamps: true });

DMConversationSchema.index({ participants: 1 });
module.exports = mongoose.model('DMConversation', DMConversationSchema);

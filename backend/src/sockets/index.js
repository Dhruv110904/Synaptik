// backend/src/sockets/index.js
const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io) => {
  const onlineUsers = new Map(); // userId -> socketId(s) array if needed

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query || {};
    if (userId) {
      onlineUsers.set(userId, socket.id);
      User.findByIdAndUpdate(userId, { online: true }).exec();
      io.emit('user_online', { userId });
    }

    socket.on('join_room', ({ roomId }) => {
      if (roomId) socket.join(`room_${roomId}`);
      socket.to(`room_${roomId}`).emit('system_message', { text: 'A user joined the room' });
    });

    socket.on('leave_room', ({ roomId }) => {
      if (roomId) socket.leave(`room_${roomId}`);
      socket.to(`room_${roomId}`).emit('system_message', { text: 'A user left the room' });
    });

    socket.on('room_message_send', async (payload, ack) => {
      // payload: { roomId, senderId, text, type, media }
      try {
        const msg = await Message.create({
          roomId: payload.roomId,
          senderId: payload.senderId,
          type: payload.type || 'text',
          text: payload.text,
          media: payload.media
        });
        const populated = await msg.populate('senderId', 'username displayName avatarUrl').execPopulate?.() || msg;
        io.to(`room_${payload.roomId}`).emit('room_message_receive', populated);
        if (ack) ack({ ok: true, message: msg });
      } catch (err) {
        if (ack) ack({ ok: false, error: err.message });
      }
    });

    socket.on('join_dm', ({ dmId }) => {
      if (dmId) socket.join(`dm_${dmId}`);
    });

    socket.on('dm_message_send', async (payload, ack) => {
      try {
        const msg = await Message.create({
          dmId: payload.dmId,
          senderId: payload.senderId,
          type: payload.type || 'text',
          text: payload.text,
          media: payload.media
        });
        const pop = await msg.populate('senderId', 'username displayName avatarUrl').execPopulate?.() || msg;
        io.to(`dm_${payload.dmId}`).emit('dm_message_receive', pop);
        if (ack) ack({ ok: true, message: msg });
      } catch (err) {
        if (ack) ack({ ok: false, error: err.message });
      }
    });

    socket.on('typing_start', ({ roomId, user }) => {
      socket.to(`room_${roomId}`).emit('typing_start', { user });
    });

    socket.on('typing_stop', ({ roomId, user }) => {
      socket.to(`room_${roomId}`).emit('typing_stop', { user });
    });

    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        User.findByIdAndUpdate(userId, { online: false, lastSeen: new Date() }).exec();
        io.emit('user_offline', { userId });
      }
    });
  });
};

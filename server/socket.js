const { formatMessage, validateInput } = require('./utils');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  isUsernameTaken
} = require('./rooms');

const botName = 'System';

function initializeSocket(io) {
  io.on('connection', (socket) => {
    // console.log('New WS Connection:', socket.id);

    socket.on('joinRoom', ({ username, room }, callback) => {
      // Input Validation
      if (!validateInput(username) || !validateInput(room)) {
        return callback({ error: 'Username and room are required.' });
      }

      // Check Duplicates
      if (isUsernameTaken(username, room)) {
        return callback({ error: 'Username is already taken in this room.' });
      }

      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

      // Welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to SecureRoom!', true));

      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`, true)
        );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });

      callback({ success: true });
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
      const user = getCurrentUser(socket.id);

      if (user && validateInput(msg)) {
        // Rate limiting or spam protection could go here
        io.to(user.room).emit('message', formatMessage(user.username, msg));
      }
    });

    // Listen for typing events
    socket.on('typing', () => {
      const user = getCurrentUser(socket.id);
      if (user) {
        socket.broadcast.to(user.room).emit('typing', user.username);
      }
    });

    socket.on('stopTyping', () => {
      const user = getCurrentUser(socket.id);
      if (user) {
        socket.broadcast.to(user.room).emit('stopTyping', user.username);
      }
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`, true)
        );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });
}

module.exports = initializeSocket;
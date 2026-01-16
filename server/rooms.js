const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

// Check for duplicate username in room
function isUsernameTaken(username, room) {
  return users.some(
    user => user.room === room && user.username.toLowerCase() === username.toLowerCase()
  );
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  isUsernameTaken
};
const moment = require('moment'); // Using native Date for zero-dep simplicity in this snippet

function formatMessage(username, text, isSystem = false) {
  return {
    username,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isSystem,
    id: Date.now() + Math.random().toString(16).slice(2)
  };
}

function validateInput(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

module.exports = {
  formatMessage,
  validateInput
};
const path = require('path');

const index = (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
};

const login = (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
};

module.exports = { index, login };

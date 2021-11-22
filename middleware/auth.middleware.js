const User = require('../models/user.model');

const loginRequired = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  return next();
};

const createUserSession = (req, res, user) => {
  req.session.userId = user._id;
};

const loadUserFromSession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return next();
  }
  User.findById(req.session.userId, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next();
    }
    // user.password = undefined;
    req.user = user;
    // req.locals.user = user;
    return next();
  });
};

module.exports = { loginRequired, createUserSession, loadUserFromSession };

const express = require('express');
const indexController = require('../controllers/index.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// router.get('/', auth.loginRequired, indexController.index);
router.get('/', indexController.index);
router.get('/login', indexController.login);

module.exports = router;

const { Router } = require('express');
const mykeepinController = require('../controllers/mykeepin.controller');

const router = Router();

router.get('/login', mykeepinController.login);
router.get('/redirect1', mykeepinController.redirect1);

module.exports = router;

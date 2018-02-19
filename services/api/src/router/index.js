const router = require('express').Router();

const log = require('../logger');

const auth = require('./auth');

router.post('/login', auth.validateEmail, auth.validatePassword, auth.login);
router.post('/register', auth.validateEmail, auth.validatePassword, auth.register);
router.get('/me', auth.authenticate, auth.getMe);

// catch api errors
router.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  log.error(err);
  res.status(400).json(err.message);
});

module.exports = router;

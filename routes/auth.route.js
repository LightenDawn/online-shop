const express = require('express');

const auth_controller = require('../controllers/auth_controller');

const router = express.Router();

router.get('/signup', auth_controller.signup);

router.post('/signup', auth_controller.signReq);

router.get('/login', auth_controller.login);

router.post('/login', auth_controller.loginUser);

router.post('/logout', auth_controller.logout);

module.exports = router;
const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

router.post('/login', loginController.login);
router.post('/signup', loginController.signup); // Add this line
router.get('/check', loginController.checkAuth); // Add route for checking auth

module.exports = router;

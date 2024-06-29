const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/',authMiddleware, userController.getAllUsers);
router.get('/:id',authMiddleware, userController.getUserById);
router.put('/:id',authMiddleware, userController.update);
router.delete('/:id',authMiddleware, userController.delete);

module.exports = router;

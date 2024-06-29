const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');


router.get('/', componentController.getComponents);

module.exports = router;

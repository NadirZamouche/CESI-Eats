const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');

router.post('/', componentController.createComponent);
router.get('/', componentController.getComponents);
router.get('/:id', componentController.getComponentById);
router.put('/:id', componentController.updateComponent);
router.delete('/:id', componentController.deleteComponent);

module.exports = router;

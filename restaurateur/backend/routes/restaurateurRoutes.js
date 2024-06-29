const express = require('express');
const router = express.Router();
const restaurateurController = require('../controllers/restaurateurController');

router.post('/', restaurateurController.createRestaurateur);
router.get('/', restaurateurController.getRestaurateurs);
router.get('/:id', restaurateurController.getRestaurateurById);
router.put('/:id', restaurateurController.updateRestaurateur);
router.delete('/:id', restaurateurController.deleteRestaurateur);

module.exports = router;

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.post('/', menuController.createMenu);
router.get('/', menuController.getMenus);
router.get('/:id', menuController.getMenuById);
router.get('/restaurateur/:id', menuController.getMenuByIdRestaurateur);
router.put('/:id', menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

module.exports = router;

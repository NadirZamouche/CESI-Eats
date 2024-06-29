const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/orderController');

router.post('/:id', commandeController.createOrder);
router.get('/', commandeController.getOrders);
router.get('/client/:id', commandeController.getOrdersByClient);
router.get('/:id', commandeController.getOrderById);
router.put('/:id', commandeController.updateOrder);
router.delete('/:id', commandeController.deleteOrder);

module.exports = router;

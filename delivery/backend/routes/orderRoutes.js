const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/delivery', orderController.getDeliveryOrders);
router.get('/deliverytaken/:id', orderController.getDeliveryTakenOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.post('/take/:id', orderController.takeOrder);
router.delete('/:id', orderController.deleteOrder);
router.get('/neworder/:id', orderController.getNewOrders);
router.put('/notif/:id', orderController.putNotifOff);

module.exports = router;

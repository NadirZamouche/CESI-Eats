const express = require('express');
const router = express.Router();
const livreurController = require('../controllers/deliveryController');

router.post('/', livreurController.createDelivery);
router.get('/', livreurController.getDeliverys);
router.get('/:id', livreurController.getDeliveryById);
router.put('/:id', livreurController.updateDelivery);
router.delete('/:id', livreurController.deleteDelivery);

module.exports = router;

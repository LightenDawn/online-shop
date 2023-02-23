const express = require('express');

const orderController = require('../controllers/order_controller');

const router = express.Router();

router.post('/', orderController.addOrder); // localhost:3000/orders

router.get('/', orderController.getOrder);

router.get('/success', orderController.getSuccess);

router.get('/failure', orderController.getFailure);

module.exports = router;
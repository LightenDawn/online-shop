const express = require('express');

const cartController = require('../controllers/cart_controller');

const router = express.Router();

// localhost:3000/cart/
router.get('/', cartController.getCart);

router.post('/items', cartController.addCartItem);

// patch()，更新一部分存在的資料
router.patch('/items', cartController.updateCartItem);

module.exports = router;
const express = require('express');

const router = express.Router();
const productController = require('../controllers/product_controller');

router.get('/products', productController.getAllProduct);

router.get('/products/:id', productController.getProductDetail);

module.exports = router;
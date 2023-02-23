const Product = require("../models/product.model");

async function getAllProduct(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("customers/products/all-products", { products: products });
  } catch (error) {
    return next(error);
  }
}

async function getProductDetail(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("customers/products/product-detail", { product: product });
  } catch (error) {
    next(error);
    return;
  }
}

module.exports = {
  getAllProduct: getAllProduct,
  getProductDetail: getProductDetail,
};

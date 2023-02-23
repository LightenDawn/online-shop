const Product = require("../models/product.model");
const Order = require('../models/order.model');
// const validation = require("../util/validation");
// const sessionFlash = require("../util/session-flash");

async function getProducts(req, res, next) {
  // 獲取資料庫資料可能會出錯，因此用try&catch
  try {
    // 從資料庫中獲取所有商品資料
    const products = await Product.findAll();
    res.render("admin/products/all-products", { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
  res.render("admin/products/new-product");
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    /// 將使用者輸入的欄位用解壓縮的方式傳遞
    ...req.body,
    // 存取multer所獲取的圖片檔案名稱
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function getUpdateProduct(req, res, next) {
  try {
    // 查找資料庫的資料
    const product = await Product.findById(req.params.id);
    // 將該資料傳遞給update-product.ejs檔案取用
    res.render("admin/products/update-product", { product: product });
  } catch (error) {
    next(error);
    return;
  }
}

async function updateProduct(req, res, next) {
  const product = new Product({
    // 將使用者輸入的資料傳遞給model中
    ...req.body,
    // _id儲存當前商品的id
    _id: req.params.id,
  });

  // 因為到更新頁面，圖片欄位為空，若不為空時，代表使用者有新增圖片
  if (req.file) {
    // 將舊圖片更新成新圖片
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
  try {
    // 透過先前的findById()，在資料庫中尋找符合id的資料，並且建立新的物件儲存該筆資料
    const product = await Product.findById(req.params.id);
    // 再透過該物件進行移除的動作
    await product.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Deleted product!" });
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render('admin/orders/admin-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
};

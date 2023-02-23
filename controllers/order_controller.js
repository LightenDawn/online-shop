const stripe = require("stripe")(
  "sk_test_51MbzLqHCh3ZqgebsHd9TDBeGp99I5Uf9Y0gzx0JKhK8eM9xTd2O35Wr9QkAcHfRfcMHX8bk1fG9XLe1IfGqxI14W004oZoscOK"
);

const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrder(req, res, next) {
  try {
    // 用session中儲存的uid去尋找orders中，使用者的所有訂單
    const orders = await Order.findAllForUser(res.locals.uid);
    // 將找尋到的所有訂單資料傳給all-orders.ejs檔案取用
    res.render("customers/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
    return;
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    // res.locals.uid在check-auth.js的middleware中有定義，當使用者登入時會儲存該使用者的id
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  // 目前只需要設置購物車資訊+使用者資訊即可
  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  // 當訂單存進資料庫中，就把session中的購物車資料給清除
  req.session.cart = null;

  // 上方的模組引入私鑰後，變為一個object
  // 透過object內建的checkout功能，建立一個sessions (與自訂的session不同)
  // 當使用者進行交易時建立的sessions，並且create以下內容
  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map(function (item) {
      return {
        // 詳細的價格資料
        price_data: {
          // 支付的貨幣
          currency: "usd",
          // 商品資訊
          product_data: {
            name: item.product.title,
          },
          // 商品價格
          unit_amount: +item.product.price.toFixed(2) * 100,
        },
        // 商品數量
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: "https://online-shop-practice.onrender.com/orders/success",
    cancel_url: "https://online-shop-practice.onrender.com/orders/failure",
  });

  res.redirect(303, session.url);
  // res.redirect('/orders');
}

function getSuccess(req, res) {
  res.render("customers/orders/success");
}

function getFailure(req, res) {
  res.render("customers/orders/failure");
}

module.exports = {
  addOrder: addOrder,
  getOrder: getOrder,
  getSuccess: getSuccess,
  getFailure: getFailure,
};

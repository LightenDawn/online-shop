const Cart = require("../models/cart.model");

function initializeCart(req, res, next) {
  let cart;

  // 如果session中沒有購物車
  if (!req.session.cart) {
    // 在session中建立購物車的會話
    cart = new Cart();
  } else {
    const sessionCart = req.session.cart;
    // 因為session中有購物車，才能進到else區塊
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    );
    // cart儲存session中的cart的items
  }

  // 將cart變數傳遞給views做取用
  res.locals.cart = cart;

  next();
}

module.exports = initializeCart;

const Product = require('./product.model');

class Cart {
  // 預設items為空陣列
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  // 更新價格
  async updatePrices() {
    // productIds儲存items中的各個商品的id
    const productIds = this.items.map(function (item) {
      return item.product.id;
    });

    
    // 透過該產品ID去尋找多個商品資訊
    const products = await Product.findMultiple(productIds);

    // 可以刪除的商品陣列
    const deletableCarItemProductIds = [];

    // 搜尋items中的各個商品
    for (const cartItem of this.items) {
      // product儲存產品是否存在的boolean值
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id;
      });

      // 如果產品不存在
      if (!product) {
        // product was deleted!
        // 'schedule' for removal from cart
        // 將該產品加入刪除的陣列
        deletableCarItemProductIds.push(cartItem.product.id);
        continue;
      }

      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableCarItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCarItemProductIds.indexOf(item.product.id) < 0;
      });
    }

    // re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }

  addItem(product) {
    // const => 指向儲存物件的記憶體
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      // 陣列中儲存的為object元素，裡面包含產品的id
      if (item.product.id === product.id) {
        // 修改記憶體中的內容
        cartItem.quantity = +item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;
        // 每更新一次，就將this.items陣列中的元素更新
        this.items[i] = cartItem;

        this.totalQuantity++;
        this.totalPrice += product.price;
        return;
      }
    }

    // 將產品加到陣列中，但是會變成['apple', 'apple'...]，會出現多筆重複的資料
    this.items.push(cartItem);
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      // item.product.id符合productId
      if (item.product.id === productId && newQuantity > 0) {
        // 將獲取到的item物件賦予給cartItem
        const cartItem = { ...item };
        // quantityChange = 使用者輸入的新數量 - 舊數量
        const quantityChange = newQuantity - item.quantity;
        // 修改cartItem中的商品數量，等於使用者輸入的數量
        cartItem.quantity = newQuantity;
        // 修改cartItem的總金額，等於使用者輸入的數量乘上商品價格
        cartItem.totalPrice = newQuantity * item.product.price;
        // 將更新後的cartItem，重新賦予到當前陣列的商品
        this.items[i] = cartItem;

        // 總數量 = 舊數量 + (使用者輸入的新數量 - 舊數量)
        this.totalQuantity = this.totalQuantity + quantityChange;
        // 總金額 = 總金額 + (使用者輸入的新數量 - 舊數量) * 商品金額
        this.totalPrice += quantityChange * item.product.price;
        // 回傳更新後的物件價格
        return { updatedItemPrice: cartItem.totalPrice };
      } else if (item.product.id === productId && newQuantity <= 0) {
        // 從items中刪除i索引的1個元素
        this.items.splice(i, 1);
        // 總數量 = 總數量 - 當前元素的數量
        this.totalQuantity = this.totalQuantity - item.quantity;
        // 總金額 = 總金額 - 當前元素的總金額
        this.totalPrice -= item.totalPrice;
        // 因為使用者輸入數量為負數，回傳0值
        return { updatedItemPrice: 0 };
      }
    }
  }
}

module.exports = Cart;

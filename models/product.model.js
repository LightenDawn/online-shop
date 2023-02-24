const mongodb = require("mongodb");

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title,
      this.summary = productData.summary,
      this.price = +productData.price,
      this.description = productData.description,
      // 圖片的名稱
      this.image = productData.image;
    // 圖片的路徑和URL
    this.updateImageDate(productData.imagePath, productData.image);
    // 獲取商品的id資料，先判定該ID有無存在
    if (productData._id) {
      // 將商品的id轉換成純字串，原先為ObjectId("!@#$%")，轉換後"@#@#$%$#^"
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      // 將productId轉換成芒果DB的ObjectId的形式
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    // 透過ObjectId尋找資料庫是否有符合的資料
    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });
      
    if (!product) {
      // Error()是JS的物件，可以自定義錯誤訊息
      const error = new Error("Could not find product with provide Id.");
      // 將錯誤碼設置為404
      error.code = 404;
      throw error;
    }
    return new Product(product);
  }

  // static: 可以不用實例化就可以呼叫該功能
  static async findAll() {
    // 獲取多筆商品資料，回傳的是一個Document
    const products = await db.getDb().collection("products").find().toArray();

    // 類似於 {0:{商品資料0}, 1:{商品資料1}...}
    return products.map(function (productDocument) {
      // 將先前獲取的商品資料，用新的物件儲存
      return new Product(productDocument);
    });
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function (id) {
      return new mongodb.ObjectId(id);
    });

    // $in包含 與sql 標準語法的用途是一樣的，即要查詢的是一系列枚舉值的範圍內
    const products = await db
      .getDb()
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageDate(imagePath, imageUrl) {
    this.imagePath = imagePath;
    this.imageUrl = `/products/assets/images/${imageUrl}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    // 如果id不為空
    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);

      // 如果使用者更新後，image欄位為空時
      if (!this.image) {
        // 將上方productData的image欄位刪除
        delete productData.image;
      }

      // 更新資料庫符合當前id的商品
      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          // 將資料設置為productData(使用者剛更新的資料)
          $set: productData,
        }
      );
    } else {
      // 若資料不存在資料庫中，則新增一筆資料
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  // 更新頁面，若使用者有上傳圖片
  async replaceImage(newImage) {
    // 將image設置為使用者更改過的image
    this.image = newImage;
    // 更新圖片的路徑和URL
    this.updateImageDate();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: productId });
  }
}

module.exports = Product;

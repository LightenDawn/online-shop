const bcrypt = require("bcryptjs");

const db = require("../data/database");
const mongodb = require("mongodb");

class User {
  // 建立使用者輸入的資料建構子
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.address = {
      street: street,
      postal: postal,
      city: city,
    };
  }

  // 使用者申請帳號 - 將資料存進Database中
  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.fullname,
      address: this.address,
    });
  }

  static findById(userId) {
    // 將傳遞進來的變數，轉換成芒果DB的ObjectId
    const uid = new mongodb.ObjectId(userId);

    // 尋找資料庫中，id相符的使用者資料，並且不回傳密碼欄位的資料
    return db
      .getDb()
      .collection("users")
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  // 檢查使用者輸入的信箱是否曾經申請過 - 有:true； 無:false
  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({
      email: this.email,
    });
  }

  // 使用者申請帳號時，透過此功能檢查信箱是否重複申請
  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  // 登入時，檢查密碼是否相同，需要用bcrypt的compare功能
  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;

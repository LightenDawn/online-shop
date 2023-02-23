const expressSession = require("express-session");
const mongodbStore = require("connect-mongodb-session");

// 官網的功能為
// const mongodbStore = require('connect-mongodb-session')(session);
// 此功能為擴充上述功能的方法
function createSessionStore() {
  let mongoUrl = "mongodb://127.0.0.1:27017";

  if (process.env.MONGODB_URL) {
    mongoUrl = process.env.MONGODB_URL;
  }

  const MongoDBStore = mongodbStore(expressSession);

  // 建立芒果DB的連結，注意: 此處為ur  i
  const store = new MongoDBStore({
    uri: mongoUrl,
    databaseName: "online-shop",
    collection: "session",
  });
  return store;
}

// 此功能為設定session的內部option
function createSessionConfig() {
  return {
    // 自定義字串，字串為隨機更好(駭客更不易取得session_id)
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    // 將資料存進芒果DB中，預設為memorySpace
    store: createSessionStore(),
    // 餅乾存在的時間
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
    sameSite: "lax",
  };
}

module.exports = createSessionConfig;

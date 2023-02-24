const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const uuid = require("uuid").v4;
const path = require('path');

// // 檔案上傳的位置
// const upload = multer({
//   // storage => 檔案儲存的地方 : multer.disStorage() => 儲存在硬碟中
//   storage: multer.diskStorage({
//     // 儲存目的地為products-data資料夾中的images資料夾內
//     destination: 'products-data/images',
//     // 設定檔案名稱 file => 使用者上傳的檔案, cb => call back()
//     filename: function(req, file, cb) {
//       // 若有錯誤，先回傳錯誤內容，這邊設為null
//       cb(null, uuid() + '-' + file.originalname);
//       // uuid() => 模組自動產生流水編號 - 檔案原本的名稱
//     }
//   })
// });

// Configuration
cloudinary.config({
  cloud_name: "dzjktn9na",
  api_key: "398746524779951",
  api_secret: "ByyCPf_ep9RASgX48m5Jl-VzAYE",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => "online-shop",
    allowedFormats: ["jpg", "jpeg", "png", "gif"],
    
    public_id: (req, file) => uuid() + '-' + path.parse(file.originalname).name
  }
});

// folder: "online-shop",
//   allowedFormats: ["jpg", "jpeg", "gif", "png"],
//   filename: function (req, file, cb) {
//     cb(null, uuid() + "-" + file.originalname);
//   },

const upload = multer({ storage: storage });

// 上傳single(一個)檔案，尋找使用者上傳的欄位名稱為'image'的input field
const configuredMulterMiddleware = upload.single('image');

module.exports = configuredMulterMiddleware;

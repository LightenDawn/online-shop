// 獲取session中的資料
function getSessionData(req) {
  // sessionData存取在session中的資料
  const sessionData = req.session.flashedData;
  // 清空session的flashedData資料
  req.session.flashedData = null;
  // 將獲取的資料回傳
  return sessionData;
}

// 快閃資料到session欄位中
function flashDataToSession(req, data, action) {
  // session的flashedData存取使用者輸入的資料
  req.session.flashedData = data;
  // session進行儲存
  req.session.save(action);
}

module.exports = {
  getSessionData: getSessionData,
  flashDataToSession: flashDataToSession
}
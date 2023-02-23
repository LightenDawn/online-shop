// 建立使用者的session
function createUserSession(req, user, action) {
  // 將session建立一個uid儲存使用者在資料庫中的id
  req.session.uid = user._id.toString();
  // 獲取使用者是不是管理者身分
  req.session.isAdmin = user.isAdmin;
  // 將session存檔
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  // 當使用者logout時，將session中的uid設為null
  req.session.uid = null;
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession
};
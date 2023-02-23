// 確認使用者的登入狀態功能
function checkAuthStatus(req, res, next) {
  // (uid)儲存session中的uid (使用者登入才有)
  const uid = req.session.uid;

  // 若(沒有uid存在)
  if (!uid) {
    // 停止動作，執行下個動作
    return next();
  }

  // 建立views可以存儲的變數uid和isAuth
  res.locals.uid = uid;
  res.locals.isAuth = true;
  res.locals.isAdmin = req.session.isAdmin;
  next();
}

module.exports = checkAuthStatus;
// 加入csrf的token
function addCsrfToken(req, res, next) {
  // 建立views可以存取的csrfToken
  res.locals.csrfToken = req.csrfToken();
  // 執行下個動作
  next();
}

module.exports = addCsrfToken;
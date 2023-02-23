// 錯誤執行
function handlerErrors(error, req, res, next) {
  // 終端機上回報錯誤
  console.log(error);

  const errorCode = error.code;
  if(errorCode === 404) {
    return res.status(404).render('shared/404');
  }
  // 將網站的error code設為500，回傳自定義錯誤碼500的頁面
  res.status(500).render('shared/500');
}

module.exports = handlerErrors;
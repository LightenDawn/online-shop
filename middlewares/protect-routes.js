function protectRoutes(req, res, next) {
  // 若沒有登入時，未經過認證
  if(!res.locals.isAuth) {
    return res.redirect('/401');
  }

  // 若是手動輸入/admin和未被授權
  if(req.path.startsWith('/admin') && !res.locals.isAdmin) {
    return res.redirect('/403');
  }

  next();
}

module.exports = protectRoutes;
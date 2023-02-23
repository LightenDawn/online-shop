const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

// 回傳使用者註冊的頁面
function signup(req, res) {
  // 將session中的data存進sessionData中
  let sessionData = sessionFlash.getSessionData(req);

  // 若sessionData為空，將值都設為空
  if(!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: ''
    };
  }

  // 將sessionData透過inputData傳入views的ejs中
  res.render("customers/auth/signup", { inputData: sessionData });
}

// 回傳非同步的使用者註冊提交表單的頁面
async function signReq(req, res, next) {
  // 將使用者輸入的資料儲存到enteredData中
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  // 進行驗證的動作 (若欄位為空且不符合條件者) or (信箱與確認信箱不一致者)
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    // 驗證失敗則將使用者輸入的內容存取到session中
    sessionFlash.flashDataToSession(
      // 觸發session的request
      req,
      {
        // 設定錯誤訊息
        errorMessage:
          "Please check your input. Password must be at least 6 characters long, postal code must be 5 characters long.",
        // ...為先前所提到的解壓縮資料
        ...enteredData,
      },
      // session存取完後，才會進行的動作
      function () {
        // 重新導向到註冊頁面
        res.redirect("/signup");
      }
    );
    // 停止動作
    return;
  }

  // 將使用者填寫的資料丟給物件User()
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  // 避免req => Database出現問題，使用try&catch
  try {
    // 呼叫models中的使用者信箱是否存在資料庫中
    const existAlready = await user.existsAlready();

    // 若存在則重新導向到註冊頁面
    if (existAlready) {
      // 使用者存在時，將使用者填入的資料存進session
      sessionFlash.flashDataToSession(
        // 觸發session的request
        req,
        {
          // 定義錯誤訊息
          errorMessage: "User exists already! Try logging in instead!",
          // 解壓縮資料
          ...enteredData,
        },
        // session儲存完畢進行的動作
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }

    // 不存在則進行將使用者填寫的資料存入資料庫中
    await user.signup();
  } catch (error) {
    // 若出現錯誤 => error handler定義的錯誤訊息將會顯示給使用者看
    next(error);
    return;
  }

  // 註冊完畢會重新導向到login頁面
  res.redirect("/login");
}

// 回傳使用者登入介面
function login(req, res) {
  // 將session中的資料傳入sessionData中
  let sessionData = sessionFlash.getSessionData(req);

  // 若sessionData為空，將值設為空
  if(!sessionData) {
    sessionData = {
      email: '',
      password: ''
    };
  }

  // 將sessionData傳入inputData，使其能夠在views的ejs中傳遞
  res.render("customers/auth/login", { inputData: sessionData });
}

// 回傳使用者非同步登入頁面
async function loginUser(req, res, next) {
  // 建立物件user，存取使用者輸入的信箱和密碼
  const user = new User(req.body.email, req.body.password);

  // 定義變數 (使用者的存在)
  let existingUser;
  try {
    // (使用者的存在) 存取資料庫中是否有與使用者輸入的信箱相同的資料
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    // 若是錯誤則回傳error handler的錯誤頁面
    next(error);
    return;
  }

  // 要儲存到session的資料
  const sessionErrorData = {
    // 錯誤訊息
    errorMessage:
      "Invalid credentials - please double-check your email and password.",
    // 使用者輸入的信箱
    email: user.email,
    // 使用者輸入的密碼
    password: user.passowrd,
  };

  // 若(使用者不存在)
  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      // 重新導向到login頁面
      res.redirect("/login");
    });
    return;
  }

  // (密碼是否正確) 透過models的密碼比對
  const passwordIsCorrect = await user.hasMatchingPassword(
    // 傳入先前從資料庫搜尋到的使用者加密過的資料
    existingUser.password
  );

  // 若(密碼不正確)
  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      // 重新導向到login頁面
      res.redirect("/login");
    });
    return;
  }

  // 建立使用者的session
  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

// 回傳使用者登出後的頁面
function logout(req, res) {
  // 消除使用者的session.uid
  authUtil.destroyUserAuthSession(req);
  // 登出後回到登入頁面
  res.redirect("/login");
}

module.exports = {
  signup: signup,
  login: login,
  signReq: signReq,
  loginUser: loginUser,
  logout: logout,
};

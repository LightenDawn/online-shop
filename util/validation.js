// 驗證value是否為空
function isEmpty(value) {
  // 回傳 value為空 或 value去掉前後空白後為空
  return !value || value.trim() === '';
}

// 使用者信用是否認證
function userCredentialsAreValid(email, password) {
  return (
    // 信箱不為空 和 信箱中包含@ 和 密碼不為空 和 密碼去掉前後空白長度大於5
    email && email.includes('@') && password && password.trim().length > 5 
    );
}

// 使用者詳細內容是否認證
function userDetailsAreValid(email, password, fullname, street, postal, city) {
  return (
    // 信箱和密碼認證
    userCredentialsAreValid(email, password) &&
    // 使用者全名/街道/郵遞區號/城市認證
    !isEmpty(fullname) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city) 
  );
}

// 信箱認證
function emailIsConfirmed(email, confirmEmail) {
  // 使用者輸入的信箱語認證信箱一致
  return email === confirmEmail;
}

function adminProductValid(title, summary, price, description) {
  return (
    !isEmpty(title) &&
    !isEmpty(summary) &&
    price > 1 && !isEmpty(price) &&
    !isEmpty(description)
  );
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
  adminProductValid: adminProductValid
}
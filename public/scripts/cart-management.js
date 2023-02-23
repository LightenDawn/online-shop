const addToCartButtonElement = document.querySelector(
  "#product-details button"
);
const cartBadgeElements = document.querySelectorAll(".nav-items .badge");

async function addToCart() {
  // 需要到按鈕內設置data-productid
  const productId = addToCartButtonElement.dataset.productid;
  // 設置data-csrf
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  try {
    // 使用ajax fetch()
    response = await fetch("/cart/items", {
      method: "POST",
      // 在post()中，有使用json()傳遞資料，需要定義express.json() middleware才能使用
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken
      }),
      // 當有json()傳遞時，會透過Content-Type來接收資料
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  // 若fetch()失敗
  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  // responseData存取fetch()獲得的json資料
  const responseData = await response.json();

  // newTotalQuantity存取responseData中的newTotalItems
  const newTotalQuantity = responseData.newTotalItems;

  for (const cartBadgeElement of cartBadgeElements){
    // 將購物車的數字ajax動態變動
    cartBadgeElement.textContent = newTotalQuantity;
  }
}

addToCartButtonElement.addEventListener("click", addToCart);

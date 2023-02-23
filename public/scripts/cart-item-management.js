const cartItemUpdateFormElements = document.querySelectorAll(".cart-item-management");
const cartTotalPriceElement = document.getElementById("cart-total-price");
const cartBadgeElements = document.querySelectorAll(".nav-items .badge");


async function updateCartItem(event) {
  // 預防網頁送出請求
  event.preventDefault();

  const form = event.target;

  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        // 此處的productId和quantity要和cart-management.js的設置名稱依樣
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    // 當前點擊的區塊的父節點 * 2，form>article>li，移除<li></li>節點
    form.parentElement.parentElement.remove();
  } else {
    // 當前點擊的區塊的父節點為article，找出底下的class="cart-item-price"的元素
    const cartItemTotalPriceElement =  form.parentElement.querySelector(".cart-item-price");
    cartItemTotalPriceElement.textContent =  responseData.updatedCartData.updatedItemPrice;
  }

  cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice;

  for (const cartBadgeElement of cartBadgeElements) {
    cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
  }
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem);
}

const productItemSelectedElements = document.querySelectorAll('.product-item button');

async function deleteItem(event) {
  const currentBtn = event.target;
  const productId = currentBtn.dataset.productid;
  const csrfToken = currentBtn.dataset.csrf;
  
  // 使用fetch()需要async-await，fetch()會回傳promise
  const response = await fetch(`/admin/products/` + productId + '?_csrf=' + csrfToken, {
    method: 'DELETE'
  });

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  currentBtn.parentElement.parentElement.parentElement.parentElement.remove();
}

for (productItemSelectedElement of productItemSelectedElements) {
  productItemSelectedElement.addEventListener('click', deleteItem);
}
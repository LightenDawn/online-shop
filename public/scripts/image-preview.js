const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview() {
  // 獲取使用者上傳檔案的資料
  const files = imagePickerElement.files;
  
  // 若沒有圖片上傳
  if(!files || files.length === 0) {
    // 若先前有先上傳過圖片，img的src還會有資料，因此可以清空該src
    imagePreviewElement.src = '';
    // 將img欄位給設置為none
    imagePreviewElement.style.display = 'none';
    return;
  } 
  // files儲存的是array，因此用pickedFile存取第一筆資料
  const pickedFile = files[0];
  // 使用URL.createObjectURL() => 建立上傳圖片的新URL()新URL(儲存在瀏覽器的memory中)，當不被需要會被釋放
  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  // 將img的欄位呈現出來
  imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);
// Lấy dữ liệu Dom từ người dùng
// Lấy dứ liêu DOM vủa form
const formProduct = document.getElementById("product-form");
const formModal = document.getElementById("form-modal");
// Lấy dữ liệu DOM người dung INPUT
const productCode = document.getElementById("product-code");
const productName = document.getElementById("product-name");
const quantityElement = document.getElementById("quantity");
const priceElement = document.getElementById("price");
const discountElement = document.getElementById("discount");
const imageElement = document.getElementById("image");
const descriptionElement = document.getElementById("description");
// Lấy DOM Làm Phân trang
const paginationElement = document.getElementById("pagination");
// Khai báo biến phân trang
let currentPage = 1; // Trang hiện tại
let itemsPerPages = 5; // Số Items trong 1 trang
// Lấy Dom cửa thẻ Tbody
const tbodyElement = document.getElementById("tbody");
// Lấy DOm cho SearchInput
const searchInput = document.getElementById("searchInput");
// Lấy dữ liệu Error khi submit form
const productCodeError = document.getElementById("productCodeError");
const productNameError = document.getElementById("productNameError");
// Lấy ra danh sách radio có name = status.
const productStatus = document.querySelectorAll("input[name=status]");
let productStatusValue = "active";
// Khai báo biên ADD / EDIT
let isEdit = false;
let editId = null;
// Khai bao biến Products khi đẩy lên LocalStory
let products = JSON.parse(localStorage.getItem("products")) || [];
let currentSearchData = [...products];
// Đóng mở modal
function handleCloseModal() {
  formProduct.style.display = "none";
}
function handleShowModal() {
  formProduct.style.display = "flex";
}
// Duyệt qua mảng Status
productStatus.forEach(function (item) {
  // Lắng nghe sự kiện khi người dùng chọn trạng thái.
  item.addEventListener("change", function (event) {
    // Lấy giá trị của ô Input đó khi dc checked vào
    if (event.target.checked) {
      productStatusValue = event.target.value;
    }
  });
});

// Hàm SUBMIT
function handleSubmit(event) {
  let isValid = true; // Hàm flag dành riêng cho validate dữ liệu
  // Ngăn chạn sự kiện submit của form
  event.preventDefault();
  // Validate báo lỗi khi mã sản phẩm bỏ trống?
  if (!productCode.value.trim()) {
    productCodeError.innerHTML = "Mã sản phẩm không được để trống";
    productCodeError.style.display = "block";
    productCode.classList.add("error-border");
    isValid = false; // Phát hiện lỗi //Đánh dấu form KHÔNG hợp lệ
  } else {
    productCodeError.style.display = "none";
    productCode.classList.remove("error-border");
  }
  // Validate báo lỗi khi tên sản phẩm bỏ trống?
  if (!productName.value.trim()) {
    productNameError.innerHTML = "Tên sản phẩm không được để trống";
    productNameError.style.display = "block";
    productName.classList.add("error-border");
    isValid = false; // Phát hiện lỗi //Đánh dấu form KHÔNG hợp lệ
  } else {
    productNameError.style.display = "none";
    productName.classList.remove("error-border");
  }
  if (!isValid) return;
  // Lưu tât cả dữ liệu vào 1 mang đối tượng mới
  let newProduct = {
    id: Math.ceil(Math.random() * 10000),
    code: productCode.value.trim(),
    name: productName.value.trim(),
    status: productStatusValue,
    quantity: Number(quantityElement.value),
    price: Number(priceElement.value),
    image: imageElement.value,
    discount: Number(discountElement.value),
    description: descriptionElement.value,
  };
  // isNaN(newProduct.price) → kiểm tra xem giá có phải là số không.
  if (isNaN(newProduct.price) || newProduct.price <= 0) {
    // newProduct.price <= 0 → giá phải lớn hơn 0.
    // Nếu 1 trong 2 điều kiện đúng → hiển thị alert báo lỗi.
    alert("Giá sản phẩm phải lớn hơn 0");
    return;
    // return → Nếu lỗi dừng hàm submit, không lưu dữ liệu
    // Như vậy, chỉ có giá hợp lệ mới đi tiếp.
  }
  if (!Number.isInteger(newProduct.quantity) || newProduct.quantity <= 0) {
    // Number.isInteger(newProduct.stock) → kiểm tra xem stock có phải số nguyên không.
    // Nếu sai → alert báo lỗi → dừng submit.
    alert("Số lượng phải là số nguyên dương");
    return;
    // Đảm bảo stock là số nguyên dương, tránh nhập -1 hoặc số thập phân.
  }
  if (!/\.(jpg|png|webp)$/i.test(newProduct.image)) {
    // /\.(jpg|png|webp)$/i →
    // là biểu thức chính quy (regex) kiểm tra đuôi file ảnh: .jpg, .png, .webp.
    alert("Hình ảnh phải là JPG, PNG hoặc WebP");
    return;
    // Đảm bảo người dùng chỉ nhập link ảnh hợp lệ.
  }
  // So sánh Trùng nhau dung .Some()
  // Khai báo biến
  const isDupCodeLaCate = products.some(
    (item) => item.code === newProduct.code && item.id !== editId
  );
  const isDupNameLaCate = products.some(
    (item) => item.name === newProduct.name && item.id !== editId
  );
  if (isDupCodeLaCate) {
    productCodeError.innerHTML = "Mã sản phẩm không được trùng nhau";
    productCodeError.style.display = "block";
    productCode.classList.add("error-border");
    return;
  } else {
    productCodeError.style.display = "none";
    productCode.classList.remove("error-border");
  }
  if (isDupNameLaCate) {
    productNameError.innerHTML = "Tên sản phẩm không được trùng nhau";
    productNameError.style.display = "block";
    productName.classList.add("error-border");
    return;
  } else {
    productNameError.style.display = "none";
    productName.classList.remove("error-border");
  }
  // CẬP NHẬT DANH MỤC (UPDATE)
  if (isEdit) {
    const index = products.findIndex((item) => item.id === editId);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        code: productCode.value,
        name: productName.value,
        status: productStatusValue,
        quantity: Number(quantityElement.value),
        price: Number(priceElement.value),
        discount: Number(discountElement.value),
        image: imageElement.value,
        description: descriptionElement.value,
      };
      isEdit = false;
      editId = null;
      alert("Cập nhật sản phẩm thành công!");
    }
  } else {
    products.unshift(newProduct);
    alert("Thêm sản phẩm thành công!");
  }
  // Cập nhật currentSearchData sau khi add/edit
  currentSearchData = [...products];
  // Lưu mang lên LocalStorage
  localStorage.setItem("products", JSON.stringify(products));
  currentPage = 1; // luôn hiển thị trang đầu
  // Reset form
  formModal.reset();
  isEdit = false;
  editId = null;
  productStatusValue = "active";
  // Render() lại bảng
  renderProduct(getDataPage(currentSearchData, currentPage));
  renderPagination(currentSearchData);
  // Đóng form
  handleCloseModal();
}
// Hàm Render() Hiển thị
function renderProduct(data = products) {
  // xoá dứ liệu trong thẻ tbody
  tbodyElement.innerHTML = "";
  // Duyệt qua mảng products
  data.forEach(function (product) {
    // Tạo thẻ Tr
    const trElement = document.createElement("tr");
    const statusText =
      product.status === "active"
        ? ` <div class="box-status bg-active">
           <div class="dot dot-active"></div>
           <span class="status-text text-active">Đang hoạt động</span>
         </div>`
        : `<div class="box-status bg-inactive">
           <div class="dot dot-inactive"></div>
           <span class="status-text text-inactive">Ngừng hoạt động</span>
         </div>`;
    trElement.innerHTML = `
    <td>${product.code}</td>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td>${product.quantity}</td>
    <td>${product.discount}</td>
    <td>${statusText}</td>
    <td>
      <div class="tbody-icon">
       <button class="delete-btn" onclick="handleDelete(${product.id})">
        <img
            src="../category-img/delete (1).png"
            alt="delete"
        />
        </button>
         <button class="edit-btn" onclick="handleEdit(${product.id})">
        <img src="../category-img/edit.png" alt="edit" />
        </button>
      </div>
    </td>
    `;
    // Gán thẻ tr vao thẻ body
    tbodyElement.appendChild(trElement);
  });
}
renderProduct();
// Tìm kiếm theo tên

searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.toLowerCase();
  currentSearchData = products.filter(
    (item) => item.name && item.name.toLowerCase().includes(keyword)
  );
  currentPage = 1;
  renderProduct(getDataPage(currentSearchData, currentPage));
  renderPagination(currentSearchData);
});
// Hàm lọc trang thái
function handleByStatus(status = "all") {
  const isStatus =
    status === "all"
      ? products
      : products.filter((item) => item.status === status);
  renderProduct(isStatus);
}
//Hàm lọc danh mục
function handleByCategory(category = "all") {
  const isCategory =
    category === "all"
      ? products
      : products.filter((item) => item.category === category);
  renderProduct(isCategory);
}

// Hàm Delete trong tbody
function handleDelete(id) {
  const isConfirm = confirm("Bạn có chắc chắn muốn xoá sản phẩm này không!");
  if (!isConfirm) return;
  products = products.filter((item) => item.id !== id);

  // Cập nhật currentSearchData sau khi xóa
  currentSearchData = [...products];
  // Nếu trang hiện tại vượt quá số trang sau khi xóa, reset về trang cuối
  const totalPages = Math.ceil(products.length / itemsPerPages);
  if (currentPage > totalPages) {
    currentPage = totalPages || 1; // nếu không còn sản phẩm, về trang 1
  }

  // Render lại dữ liệu phân trang
  renderProduct(getDataPage(currentSearchData, currentPage));
  renderPagination(currentSearchData);
}
// Hàm edit trong Tbody
function handleEdit(id) {
  const productEdit = products.find((item) => item.id === id);
  if (!productEdit) return;
  // ĐỔ dữ liệu về mảng
  document.getElementById("product-code").value = productEdit.code;
  document.getElementById("product-name").value = productEdit.name;
  document.getElementById("quantity").value = productEdit.quantity;
  document.getElementById("price").value = productEdit.price;
  document.getElementById("discount").value = productEdit.discount;
  document.getElementById("image").value = productEdit.image;
  document.getElementById("description").value = productEdit.description;
  document.querySelector(
    `input[name="status"][value=${productEdit.status}]`
  ).checked = true;
  isEdit = true;
  editId = productEdit.id;
  renderPagination(currentSearchData);
  // Bật modal nếu form trong modal
  handleShowModal();
}
// Hàm lấy dữ liệu của 1 trang
function getDataPage(data, page) {
  const start = (page - 1) * itemsPerPages;
  const end = start + itemsPerPages;
  return data.slice(start, end);
}
// Hàm render nút phân trang
function renderPagination(data) {
  // Xoá toàn bộ nut cũ
  paginationElement.innerHTML = "";
  // Tạo Hàm tính toàn số trang
  const totalPages = Math.ceil(data.length / itemsPerPages);
  // Duyệt từ trang 1 đến trang totalPages
  for (let i = 1; i <= totalPages; i++) {
    // Tạo 1 thẻ <button> cho trang i.
    const btn = document.createElement("button");
    // Hiển thị số trang trên nút (1, 2, 3 …).
    btn.innerText = i;
    if (i === currentPage) {
      btn.classList.add("activeFooter");
    }
    btn.addEventListener("click", function () {
      currentPage = i;
      renderProduct(getDataPage(data, currentPage));
      renderPagination(data);
    });
    paginationElement.appendChild(btn);
  }
}

// Render ban đầu
renderProduct(getDataPage(currentSearchData, currentPage));
renderPagination(currentSearchData);

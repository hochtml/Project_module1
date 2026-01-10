// Lấy dom từ HTML
const formCategory = document.getElementById("form-category");
const categoryCodeInput = document.getElementById("category-code");
const categoryNameInput = document.getElementById("category-name");
// Lấy ra danh mục tìm kiếm theo tên.
const searchElement = document.getElementById("searchInput");
// Lấy ra danh mục Tbody
const tbodyElement = document.getElementById("tbody");
// Lấy ra danh sách radio có name = status.
const categoryStatus = document.querySelectorAll("input[name=status]");
let categoryStatusValue = "active";
// Lấy biến ADD / Edit
let isEdit = false;
let editId = null;
// Lấy biến Phân Trang
let currentPage = 1;
const itemsPerPage = 5; // mỗi trang 5 danh mục
// Lấy ra danh mục Error báo lỗi
const categoryCodeError = document.getElementById("categoryCodeError");
const categoryNameError = document.getElementById("categoryNameError");
// Mảng chứa danh sách danh mục
let categories = JSON.parse(localStorage.getItem("categories")) || [];
// Lắng nghe sự kiện khi người dùng chọn trạng thái.
categoryStatus.forEach(function (item) {
  // Lắng nghe sự kiện khi người dung change
  item.addEventListener("change", function (event) {
    // Input nào dc checked thì sẽ lấy giá trị của input đó
    if (event.target.checked) {
      categoryStatusValue = event.target.value;
    }
  });
});
//Hàm mở modal / Thêm mới / Cập nhật danh mục.
function handleShowModal() {
  formCategory.style.display = "flex";
}
// Hàm đóng form
function handleCloseModal() {
  formCategory.style.display = "none";
}
// Hàm submit
function handleSubmit(event) {
  let isValid = true; // BIẾN RIÊNG CHO VALIDATE //Nó là biến cờ (flag) dùng cho VALIDATE form
  // Ngăn chặn sự kiện submit trong form
  event.preventDefault();
  // Validate dữ liệu
  // Validate mã sản khẩm báo lỗi khi để trống.
  if (!categoryCodeInput.value.trim()) {
    categoryCodeError.innerHTML = "Mã sản phẩm không được để trống";
    categoryCodeError.style.display = "block";
    categoryCodeInput.classList.add("input-error");
    isValid = false; // Phát hiện lỗi //Đánh dấu form KHÔNG hợp lệ
  } else {
    categoryCodeError.style.display = "none";
    categoryCodeInput.classList.remove("input-error");
  }
  // Validate tên sản khẩm báo lỗi khi để trống.
  if (!categoryNameInput.value.trim()) {
    categoryNameError.innerHTML = "Tên sản phẩm không được để trống";
    categoryNameError.style.display = "block";
    categoryNameInput.classList.add("input-error");
    isValid = false; // Phát hiện lỗi //Đánh dấu form KHÔNG hợp lệ
  } else {
    categoryNameError.style.display = "none";
    categoryNameInput.classList.remove("input-error");
  }
  if (!isValid) return;

  // Nhóm dữ liệu thành 1 mảng đối tượng
  let newCategory = {
    id: Math.ceil(Math.random() * 10000),
    code: categoryCodeInput.value,
    name: categoryNameInput.value,
    status: categoryStatusValue,
  };
  // So sánh trùng nhau
  const isDupCodeLiCate = categories.some(
    (item) => item.code === newCategory.code && item.id !== editId
  );
  const isDupNameLiCate = categories.some(
    (item) => item.name === newCategory.name && item.id !== editId
  );
  if (isDupCodeLiCate) {
    categoryCodeError.innerHTML = "Mã sản phẩm không được trùng nhau";
    categoryCodeError.style.display = "block";
    categoryCodeInput.classList.add("input-error");
    return;
  }
  if (isDupNameLiCate) {
    categories.some((item) => {
      item.name === newCategory.name && item.id !== editId;
    });
    categoryNameError.innerHTML = "Tên sản phẩm không được trùng nhau";
    categoryNameError.style.display = "block";
    categoryNameInput.classList.add("input-error");
    return;
  }
  // CẬP NHẬT DANH MỤC (UPDATE)
  // isEdit = true → đang ở chế độ SỬA danh mục (UPDATE)
  if (isEdit) {
    // Tìm vị trí (index) của danh mục có id = editId trong mảng categories
    // findIndex trả về:
    //  - index (0,1,2,...) nếu tìm thấy
    //  - -1 nếu KHÔNG tìm thấy
    const index = categories.findIndex((item) => item.id === editId);
    // Kiểm tra có tìm thấy danh mục không
    if (index !== -1) {
      // index !== -1 → đã tìm thấy → cho phép cập nhật
      // Ghi đè lại danh mục cũ bằng object mới
      categories[index] = {
        ...categories[index],
        code: categoryCodeInput.value,
        name: categoryNameInput.value,
        status: categoryStatusValue,
      };
      editId = null; // Xóa ID của danh mục đang sửa
      isEdit = false; // Thoát khỏi chế độ sửa (EDIT MODE)
      alert("Cập nhật danh mục thành công");
    }
  } else {
    // Push phần newCategory vào trong mang categories
    categories.unshift(newCategory);
    alert("Thêm danh mục thành công.");
  }
  // Lưu toàn bộ danh sách danh mục (categories) vào LocalStorage
  // let categories = JSON.parse(localStorage.getItem("categories")) || [];
  // Cặp này luôn đi cùng nhau //Lưu : JSON.stringify //	Lấy : JSON.parse
  localStorage.setItem("categories", JSON.stringify(categories));
  // reset form
  categoryCodeInput.value = "";
  categoryNameInput.value = "";
  document.querySelector("input[name=status][value=active]").checked = true;
  // Render() lại bảng
  renderCategories();
  // Đóng form
  handleCloseModal();
}
// Hàm render() Hiển thị
function renderCategories(data = categories) {
  // Xoá hêt các phân tử có trong tbody
  tbodyElement.innerHTML = "";
  // TÍNH TOÁN PHÂN TRANG
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = data.slice(start, end);
  // Duyệt qua mảng categories
  pageData.forEach(function (category) {
    // Tạo thẻ trElement
    const trElement = document.createElement("tr");
    trElement.classList.add("style-tr");
    // Gán lại giá trị cho thẻ status
    const statusText =
      category.status === "active"
        ? ` <div class="box-status bg-active">
           <div class="dot dot-active"></div>
           <span class="status-text text-active">Đang hoạt động</span>
         </div>`
        : `<div class="box-status bg-inactive">
           <div class="dot dot-inactive"></div>
           <span class="status-text text-inactive">Ngừng hoạt động</span>
         </div>`;
    // Gán mảng cào thẻ tr
    trElement.innerHTML = `
    <td class="body-item">${category.code}</td>
      <td class="body-item">${category.name}</td>
      <td class="body-item">${statusText}</td>
      <td class="body-item">
        <button onclick="handleDelete(${category.id})" class="delete-btn">
          <img src="../category-img/delete (1).png" alt="icon" />
        </button>
        <button onclick="handleEdit(${category.id})" class="edit-btn">
          <img src="../category-img/edit.png" alt="icon">
        </button>
      </td>
    `;
    tbodyElement.appendChild(trElement);
  });
  renderPagination(data);
}
// Hàm tìm kiếm theo tên
searchElement.addEventListener("input", function () {
  const keyword = searchElement.value.toLowerCase();
  let result = categories.filter(
    (item) => item.name && item.name.toLowerCase().includes(keyword)
  );
  currentPage = 1;
  renderCategories(result);
});
// Hàm xoá phẩn tử trong Tbody
function handleDelete(id) {
  const produsts = JSON.parse(localStorage.getItem("products")) || [];
  const hasproduct = produsts.some((product) => product.categoryId === id);
  if (hasproduct) {
    alert("Danh mục đang có sản phẩm, không thể xóa!");
    return;
  }
  if (!confirm("Bạn có chắc chắn muốn xoá không.")) return;
  categories = categories.filter((item) => item.id !== id);
  localStorage.setItem("categories", JSON.stringify(categories));
  renderCategories();
}
// Hàm sửa phẩn tử trong Tbody
function handleEdit(id) {
  const categoryEdit = categories.find((item) => item.id === id);
  if (!categoryEdit) return;
  // K tìm thấy dừng hàm
  // ĐỔ dữ liệu về form
  document.getElementById("category-code").value = categoryEdit.code;
  document.getElementById("category-name").value = categoryEdit.name;
  document.querySelector(
    `input[name="status"][value="${categoryEdit.status}"]`
  ).checked = true;

  isEdit = true;
  editId = id;
  // mở form
  handleShowModal();
}

// HÀM PHÂN BIỆT TRẠNG THÁI
function handleByStatus(status = "all") {
  const result =
    status === "all"
      ? categories
      : categories.filter((item) => item.status === status);
  renderCategories(result);
}
// Hàm sắp xếp theo tên
let issortByName = true;
function sortByName() {
  const sorted = [...categories].sort((a, b) => {
    if (issortByName) {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  issortByName = !issortByName;
  renderCategories(sorted);
}
// HÀM RENDER NÚT PHÂN TRANG
function renderPagination(data) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // NÚT PREV
  const prevBtn = document.createElement("button");
  prevBtn.innerText = "‹";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderCategories(data);
  };
  pagination.appendChild(prevBtn);

  // CÁC SỐ TRANG
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    if (i === currentPage) btn.classList.add("button-active");

    btn.onclick = () => {
      currentPage = i;
      renderCategories(data);
    };

    pagination.appendChild(btn);
  }

  // NÚT NEXT
  const nextBtn = document.createElement("button");
  nextBtn.innerText = "›";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderCategories(data);
  };
  pagination.appendChild(nextBtn);
}
renderCategories();

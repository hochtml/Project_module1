//----------------------------------------------
//--- DỮ LIỆU----  ///
const localProduct = "product"; // Tên key trong localStorage
let currentData = []; // Dữ liệu hiện tại hiển thị trong bảng
let isEdit = false; // Flag: false = thêm mới, true = chỉnh sửa
let editId = null; // Lưu id sản phẩm đang chỉnh sửa
//  Hàm Lưu Dữ liệu
function saveLocalStorage() {
  // Chuyển mảng products thành JSON string và lưu vào localStorage
  localStorage.setItem(localProduct, JSON.stringify(products));
}
//--- LOAD DỮ LIỆU----  ///
let products = JSON.parse(localStorage.getItem(localProduct));
// Lấy dữ liệu từ localStorage
if (!products || products.length === 0) {
  // Nếu chưa có dữ liệu
  // Tạo dữ liệu mặc định 2 sản phẩm
  products = [
    {
      id: 1,
      product_code: "SP001",
      product_name: "Táo",
      category_id: 1,
      stock: 100,
      price: 20000,
      discount: 0,
      image: "https://example.com/image.jpg",
      status: "ACTIVE",
      description: "Táo nhập khẩu từ mỹ",
      createdAt: "2021-01-01T00:00:00Z",
    },
    {
      id: 2,
      product_code: "SP002",
      product_name: "Cà chua",
      category_id: 2,
      stock: 100,
      price: 20000,
      discount: 0,
      image: "https://example.com/image.jpg",
      status: "ACTIVE",
      description: "Cà chua nhập khẩu từ Hà Lan",
      createdAt: "2021-01-01T00:00:00Z",
    },
  ];
  saveLocalStorage(); // Lưu dữ liệu mẫu vào localStorage
}

//.....................................................................................
//------------------------HIỂN THỊ DANH SÁCH SẢN PHẨM (RENDER) OK----------------------

// ==== 2. RENDER DANH SÁCH SẢN PHẨM ===== //
// tbody chứa các sản phẩm
const tbody = document.getElementById("body-form");
// container phân trang
const paginationElement = document.getElementById("pagination");
// số sản phẩm hiển thị 1 trang
const itemsPerPage = 2;
// trang hiện tại
let currentPage = 1;
// HAM RENDER
function renderProduct(data, page = 1) {
  // Xóa dữ liệu cũ
  tbody.innerHTML = "";
  // index bắt đầu của trang
  const start = (page - 1) * itemsPerPage;
  // index kết thúc của trang
  const end = start + itemsPerPage;
  // Lấy sản phẩm của trang hiện tại
  const paginatedData = data.slice(start, end); // Lấy dữ liệu của trang hiện tại

  paginatedData.forEach((item) => {
    // tạo 1 hàng
    const tr = document.createElement("tr");
    // thêm class css
    tr.classList.add("style-tr");
    //Tạo Hàm render status
    function renderStatus(status) {
      if (status === "ACTIVE") {
        // nếu đang hoạt động
        return `
           <div class="box-status bg-active">
           <div class="dot dot-active"></div>
           <span class="status-text text-active"
           >Đang hoạt động</span
           >
         `;
      } else {
        // nếu ngừng hoạt động
        return `
         <div class="box-status bg-inactive">
            <div class="dot dot-inactive"></div>
            <span class="status-text text-inactive"
            >Ngừng hoạt động</span
            >
         </div>
            `;
      }
    }
    // Điền thông tin sản phẩm vào tr
    tr.innerHTML = `
    <td>${item.product_code}</td>
    <td>${item.product_name}</td>
    <td>${item.price}</td>
    <td>${item.stock}</td>
    <td>${item.discount}</td>
    <td>${renderStatus(item.status)}</td>
    <td>
      <div class="tbody-icon">
       <button class="delete-btn" onclick="deleteProduct(${item.id})">
        <img
            src="../category-img/delete (1).png"
            alt="delete"
        />
        </button>
         <button class="edit-btn" onclick="editProduct(${item.id})">
        <img src="../category-img/edit.png" alt="edit" />
        </button>

      </div>
    </td>
    `;
    // thêm tr vào tbody
    tbody.appendChild(tr);
  });
  // Cập nhật thanh phân trang
  renderPagination(data.length, page);
}
// Hàm tạo nút phân trang
function renderPagination(totalItem, page) {
  // tính tổng số trang
  const totalPages = Math.ceil(totalItem / itemsPerPage);
  // xóa các nút cũ
  paginationElement.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button"); // tạo nút
    btn.innerText = i;
    // Gán class cho nút trang hiện tại
    if (i === page) {
      btn.classList.add("button-active"); // đánh dấu trang hiện tại
    }
    // Gán sự kiện click cho tất cả nút
    // click nút
    btn.addEventListener("click", () => {
      currentPage = i; // chuyển trang
      renderProduct(currentData, currentPage); // render lại
    });

    // Thêm nút vào container
    paginationElement.appendChild(btn);
  }
}
currentData = [...products]; // sao chép mảng gốc vào currentData
renderProduct(currentData, currentPage); // render lần đầu

//..........................................................................................

// ======= 3. TÌM KIẾM THEO TÊN ========= ///
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const keyword = this.value.trim().toLowerCase(); // chuyển keyword thành chữ thường
  if (keyword === "") {
    currentData = [...products]; // nếu trống → show tất cả
  } else {
    currentData = products.filter(
      (item) => item.product_name.toLowerCase().includes(keyword) // lọc sản phẩm chứa keyword
    );
  }
  currentPage = 1; // quay về trang 1
  renderProduct(currentData, currentPage); // render lại
});
//4. LỌC (DANH MỤC – TRẠNG THÁI – GIÁ)
// Tạo hàm lọc
function filterProduct({ categoryId, status, maxPrice, minPrice }) {
  let result = [...products];
  if (categoryId) {
    result = result.filter((item) => item.category_id === categoryId);
  }
  if (status) {
    result = result.filter((item) => item.status === status);
  }
  if (minPrice != null) {
    result = result.filter((item) => item.price >= minPrice);
  }
  if (maxPrice != null) {
    result = result.filter((item) => item.price <= maxPrice);
  }
  currentData = result; // BẮT BUỘC
  currentPage = 1;
  renderProduct(currentData, currentPage);
}
//-------------------------------------------------------------------
// =============== 5. SẮP XẾP =============  0K  //
// Tạo hàm sắp xếp
function sortProduct(type) {
  // Tạo bản sao của mảng products
  // Không làm thay đổi mảng gốc
  //👉 Vì sort() sẽ làm đổi mảng, nên phải copy trước
  let sorted = [...currentData];
  if (type === "name") {
    sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
  }
  if (type === "price") {
    sorted.sort((a, b) => b.price - a.price);
  }
  if (type === "createdAt") {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  currentData = sorted; // BẮT BUỘC
  currentPage = 1;
  renderProduct(currentData, currentPage);
}
// 7. THÊM MỚI SẢN PHẨM LOCALSTORAGE
//JS – MỞ / ĐÓNG FORM (OK)
const form = document.getElementById("overlay");
const btnAdd = document.getElementById("btnAdd");
const closeBtn = document.getElementById("closeBtn");
const deleteBtn = document.getElementById("deleteBtn");

btnAdd.addEventListener("click", () => {
  overlay.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
});
deleteBtn.addEventListener("click", function () {
  overlay.style.display = "none";
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // ==== RESET ERROR ====
  const errorProductCode = document.getElementById("errorProductCode");
  const errorProductName = document.getElementById("errorProductName");
  const productCode = document.getElementById("productCode");
  const productName = document.getElementById("productName");

  errorProductCode.style.display = "none";
  productCode.style.border = "";

  errorProductName.style.display = "none";
  productName.style.border = "";

  // ==== LẤY DỮ LIỆU FORM ====
  const newProduct = {
    product_code: productCode.value.trim(),
    product_name: productName.value.trim(),
    category_id: 1,
    stock: Number(document.getElementById("stock").value),
    price: Number(document.getElementById("price").value),
    discount: Number(document.getElementById("discount").value),
    image: document.getElementById("image").value.trim(),
    status:
      document.querySelector('input[name="active"]:checked')?.value || "ACTIVE",
    description: document.getElementById("description").value.trim(),
    createdAt: new Date().toISOString(),
  };

  // ==== VALIDATE ====
  //isValid => Là một biến cờ (flag) dùng để theo dõi trạng thái hợp lệ hay không của form.
  //Ban đầu isValid = true → giả sử form hợp lệ.
  //Khi gặp lỗi (ví dụ: Mã SP trống, Tên SP trống, trùng…) → ta gán:
  //Khi isValid = false, form sẽ không submit, các lỗi sẽ hiển thị.
  //Khi isValid = true, dữ liệu mới được lưu và form submit bình thường.
  let isValid = true;

  // Kiểm tra trống Mã SP
  if (!newProduct.product_code) {
    errorProductCode.innerText = "Mã sản phẩm không được để trống";
    errorProductCode.style.display = "block";
    productCode.style.border = "1px solid red";
    isValid = false; //=> Khi gặp lỗi (ví dụ: Mã SP trống, Tên SP trống, trùng…) → ta gán = false
  }

  // Kiểm tra trống Tên SP
  if (!newProduct.product_name) {
    errorProductName.innerText = "Tên sản phẩm không được để trống";
    errorProductName.style.display = "block";
    productName.style.border = "1px solid red";
    isValid = false; //=> Khi gặp lỗi (ví dụ: Mã SP trống, Tên SP trống, trùng…) → ta gán = false
  }

  // Kiểm tra trùng khi thêm mới hoặc edit
  if (isEdit) {
    //→ KIỂM TRA LẦN 1 KHI SẢN PHẨM ĐANG SỬA
    // (Cần kiểm tra trùng nhưng bỏ qua sản phẩm hiện tại đang edit (item.id !== editId).)
    //isEdit là biến Flag cho biết bạn đang chỉnh sửa sản phẩm cũ (true)
    //  hay thêm mới sản phẩm (false).
    if (
      products.some(
        (item) =>
          item.product_code === newProduct.product_code && item.id !== editId
        //editId là id của sản phẩm đang edit, dùng để bỏ qua chính sản phẩm đó khi kiểm tra trùng.
      )
    ) {
      errorProductCode.innerText = "Mã sản phẩm không được trùng nhau";
      errorProductCode.style.display = "block";
      productCode.style.border = "1px solid red";
      isValid = false; //=> Khi gặp lỗi (ví dụ: Mã SP trống, Tên SP trống, trùng…) → ta gán = false
    }
    if (
      products.some(
        (item) =>
          item.product_name === newProduct.product_name && item.id !== editId
      )
    ) {
      errorProductName.innerText = "Tên sản phẩm không được trùng nhau";
      errorProductName.style.display = "block";
      productName.style.border = "1px solid red";
      isValid = false; //=> Khi gặp lỗi (ví dụ: Mã SP trống, Tên SP trống, trùng…) → ta gán = false
    }
  } else {
    //→ KIỂM TRA LẦN 2 KHI ĐANG THÊM MỚI
    // (Cần kiểm tra toàn bộ danh sách mà không bỏ qua gì, vì không có sản phẩm nào đang edit.)
    if (
      // .some() kiểm tra có ít nhất 1 phần tử trong mảng thỏa điều kiện không.
      //Điều kiện: item.product_code === newProduct.product_code && item.id !== editId
      //Nghĩa là: tìm xem có sản phẩm nào khác (không phải sản phẩm đang edit) cùng Mã SP mới không.
      products.some((item) => item.product_code === newProduct.product_code)
    ) {
      // Nếu có sản phẩm trùng:
      errorProductCode.innerText = "Mã sản phẩm không được trùng nhau";
      //→ hiển thị text lỗi dưới input Mã SP.
      errorProductCode.style.display = "block";
      //→ bật hiển thị span lỗi.
      productCode.style.border = "1px solid red";
      //→ highlight input đỏ để báo lỗi.
      isValid = false;
      //=> Khi gặp lỗi (ví dụ: Mã SP trống, Tên SP trống, trùng…) → ta gán = false
      //→ đánh dấu form không hợp lệ, ngăn submit.
    }
    if (
      products.some((item) => item.product_name === newProduct.product_name)
    ) {
      errorProductName.innerText = "Tên sản phẩm không được trùng nhau";
      errorProductName.style.display = "block";
      productName.style.border = "1px solid red";
      isValid = false; //=> Khi gặp lỗi (ví dụ: Mã SP trống, Tên SP trống, trùng…) → ta gán = false
    }
  }

  if (!isValid) return;
  // isValid là biến cờ (flag) đã được đặt ở trên khi kiểm tra Mã sản phẩm và Tên sản phẩm.
  // Nếu có lỗi Mã SP hoặc Tên SP → isValid = false.
  // !isValid nghĩa là: nếu form không hợp lệ.
  // return; → dừng hàm submit, dữ liệu không được lưu, form không submit.
  // Nói cách khác: nếu lỗi Mã hoặc Tên, ngăn người dùng submit.
  // ==== ALERT CHO CÁC LỖI KHÁC ====
  if (isNaN(newProduct.price) || newProduct.price <= 0) {
    // isNaN(newProduct.price) → kiểm tra xem giá có phải là số không.
    // newProduct.price <= 0 → giá phải lớn hơn 0.
    // Nếu 1 trong 2 điều kiện đúng → hiển thị alert báo lỗi.
    alert("Giá sản phẩm phải lớn hơn 0");
    return;
    // return → Nếu lỗi dừng hàm submit, không lưu dữ liệu
    // Như vậy, chỉ có giá hợp lệ mới đi tiếp.
  }
  if (!Number.isInteger(newProduct.stock) || newProduct.stock <= 0) {
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

  // ==== LƯU DỮ LIỆU ====
  //isEdit → đang sửa
  //!isEdit → thêm mới
  // Kiểm tra xem đang là edit hay thêm mới
  if (isEdit) {
    // Nếu đang edit: tìm vị trí sản phẩm trong mảng products dựa vào editId
    const index = products.findIndex((item) => item.id === editId);
    // Nếu tìm thấy sản phẩm
    if (index !== -1) {
      // Cập nhật sản phẩm cũ với dữ liệu mới từ form
      // ...products[index] giữ lại các trường cũ không thay đổi
      // ...newProduct ghi đè các trường mới
      products[index] = { ...products[index], ...newProduct };
    }
    // Reset trạng thái edit
    isEdit = false;
    editId = null;
    // Thông báo cho người dùng
    alert("Cập nhật sản phẩm thành công!");
  } else {
    // Nếu đang thêm mới sản phẩm
    // Tạo id mới cho sản phẩm
    // Nếu mảng products không rỗng -> id = max(id) + 1
    // Nếu rỗng -> id = 1
    newProduct.id = products.length
      ? Math.max(...products.map((p) => p.id)) + 1
      : 1;
    // Thêm sản phẩm mới vào mảng products
    products.push(newProduct);
    // Thông báo cho người dùng
    alert("Thêm sản phẩm thành công!");
  }
  // Lưu mảng products vào localStorage
  saveLocalStorage();
  // Cập nhật currentData (dữ liệu đang hiển thị) từ mảng products
  currentData = [...products];
  // Reset về trang 1 sau khi thêm/sửa/xóa
  currentPage = 1;
  // Render lại danh sách sản phẩm lên giao diện
  renderProduct(currentData, currentPage);
  // Ẩn form sau khi lưu
  overlay.style.display = "none";
  // Reset form về trạng thái trống
  form.reset();
});

// ==== Hàm Delete ====//
function deleteProduct(id) {
  // 1. Hỏi người dùng xác nhận trước khi xóa
  const deleteConfirm = confirm(`Bạn có chắc chắn muốn xoá không?`);
  if (!deleteConfirm) return;
  // Nếu người dùng nhấn "Cancel" thì dừng
  // 2. Lọc ra sản phẩm không bị xóa (giữ lại tất cả sản phẩm khác)
  products = products.filter((item) => item.id !== id);
  // 3. Cập nhật lại dữ liệu hiển thị
  currentData = [...products];
  // 4. Lưu localStorage
  saveLocalStorage();
  // 5. Fix phân trang (tránh trang rỗng)
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  // tính tổng số trang
  if (currentPage > totalPages) currentPage = totalPages || 1;
  // nếu trang hiện tại > tổng trang → quay về trang cuối hoặc 1
  // 6. Render lại danh sách sản phẩm
  renderProduct(currentData, currentPage);
}
// ==== HÀM SỬA SẢN PHẨM ==== //
function editProduct(id) {
  // 1. Tìm sản phẩm theo id
  const product = products.find((item) => item.id === id);
  if (!product) return;
  // Nếu không tìm thấy sản phẩm → dừng hàm
  // 2. Hiển thị form
  overlay.style.display = "flex";
  // 3. Đổ dữ liệu sản phẩm lên form để người dùng chỉnh sửa
  document.getElementById("productCode").value = product.product_code;
  document.getElementById("productName").value = product.product_name;
  document.getElementById("stock").value = product.stock;
  document.getElementById("price").value = product.price;
  document.getElementById("discount").value = product.discount;
  document.getElementById("image").value = product.image;
  document.getElementById("description").value = product.description;
  // 4. Set trạng thái active (radio button)
  document.querySelector(
    `input[name="active"][value="${product.status}"]`
  ).checked = true;
  // 5. Đánh dấu trạng thái đang sửa
  isEdit = true;
  // Biến cờ dùng để biết form đang ở chế độ sửa
  editId = id;
  // Lưu id sản phẩm đang sửa để khi submit form biết update sản phẩm nào
}

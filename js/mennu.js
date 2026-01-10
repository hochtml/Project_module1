// tạo hàm menu mới
function renderMenu(keyActive) {
  // Tạo mảng menu mới
  const menuItem = [
    {
      key: "dashboard",
      name: "Thống kê",
      link: "./dashboard.html",
      icon: ' <i class="fa-solid fa-house"></i>',
    },
    {
      key: "category-manager",
      name: "Danh mục",
      link: "./category-manager.html",
      icon: '<i class="fa-solid fa-list"></i>',
    },
    {
      key: "product-manager",
      name: "Sản phẩm",
      link: "./product-manager.html",
      icon: '<i class="fa-brands fa-product-hunt"></i>',
    },
  ];
  let menuHTML = `
   <div class="header-logo">
    <img src="../category-img/category.png" alt="logo" />
    </div>
    <nav class="menu-list">
  `;
  // Duyệt mảng menuItem
  menuItem.forEach(function (item) {
    menuHTML += `<a  href="${item.link}" class="link-item ${
      keyActive === item.key ? "active" : "" // Thằng nào trung key thi active còn không thì cho nó là mảng rỗng.
    }">
       ${item.icon}
        <span class="menu-title">${item.name}</span>
    </a>`;
  });
  menuHTML += `</nav>`;
  return menuHTML;
}

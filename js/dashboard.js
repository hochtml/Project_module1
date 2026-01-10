const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất không?")) return;
    //Xoá dữ liệu trên localStorage
    localStorage.clear();
    const mng = document.createElement("p");
    mng.innerText = "Bạn đăng xuất thành công!";
    mng.style.color = "green";
    document.body.appendChild(mng);

    setTimeout(function () {
      // Chuyển hướng về trang đăng nhập
      window.location.href = "login.html";
    }, 1500);
  });
}

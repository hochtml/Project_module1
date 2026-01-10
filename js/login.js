// Lấy dứ liệu từ form
// 1. Form
const formSubmit = document.getElementById("form-login");
// 2.Email
const emailElement = document.getElementById("email");
const emailError = document.getElementById("emailError");
//Password
const passwordElement = document.getElementById("password");
const passwordError = document.getElementById("passwordError");
//Checked
const agreeElement = document.getElementById("agree");
const agreeError = document.getElementById("agreeError");

const validateEmail = function (email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
//submit-form
formSubmit.addEventListener("submit", function (e) {
  // Chặn submit trang
  e.preventDefault();
  // Validate dữ liệu từ form
  if (!emailElement.value) {
    emailError.style.display = "block";
  } else {
    emailError.style.display = "none";
    //Kiểm tra email
    if (!validateEmail(emailElement.value)) {
      emailError.style.display = "block";
      emailError.innerHTML = "** Email không đúng định dạng.";
    }
  }
  if (!passwordElement.value) {
    passwordError.style.display = "block";
  } else {
    passwordError.style.display = "none";
  }
  //Lấy dứ liệu local về
  const userLocal = JSON.parse(localStorage.getItem("users")) || [];
  // Tìm kiếm Email và mật khẩu có trên local hay không?
  const userFind = userLocal.find(
    (user) =>
      user.email === emailElement.value &&
      user.password === passwordElement.value
  );
  if (!userFind) {
    // Nếu không thì thông báo cho người dung nhập lại dữ liệu.
    alert("Email hoặc mật khẩu không đúng");
  } else {
    setTimeout(function () {
      // Nếu có thi dang nhập thanh công và chuyển hướng về Dashboard?
      window.location.href = "dashboard.html";
    }, 1000);
  }
});

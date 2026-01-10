//==>Lấy ra element của trang
//1.form
const formRegister = document.getElementById("form-register");
// 2.Surname (Họ tên đệm)
const surnameElement = document.getElementById("surname");
const surnameError = document.getElementById("surnameError");
// 3.UserName
const usernameElement = document.getElementById("username");
const usernameError = document.getElementById("usernameError");
//4. Email
const emailElement = document.getElementById("email");
const emailError = document.getElementById("emailError");
//5.Password
const passwordElement = document.getElementById("password");
const passwordError = document.getElementById("passwordError");
//6.ConfirmPassword
const confirmElement = document.getElementById("confirm");
const confirmError = document.getElementById("confirmError");
// 7.Submit-Btn
const agreeElement = document.getElementById("agree");
const agreeError = document.getElementById("agreeError");
// -------------------------------------------------------------------//
//Lấy dứ liệu từ localStorage về js
const userLocal = JSON.parse(localStorage.getItem("users")) || [];
function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}
//==> Lắng nghe sự kiện submit của form đang ký tài khoản.
formRegister.addEventListener("submit", function (e) {
  // Ngăn chặn sự kiện load lại trang.
  e.preventDefault();
  // Validate dữ liệu đầu vào.
  if (!surnameElement.value) {
    // Hiển thị lỗi lên.
    surnameError.style.display = "block";
  } else {
    // Ẩn lỗi đi.
    surnameError.style.display = "none";
  }
  if (!usernameElement.value) {
    // Hiển thị lỗi lên.
    usernameError.style.display = "block";
  } else {
    // Ẩn lỗi đi.
    usernameError.style.display = "none";
  }
  if (!emailElement.value) {
    // Hiển thị lỗi lên.
    emailError.style.display = "block";
  } else {
    // Ẩn lỗi đi.
    emailError.style.display = "none";
    //Kiểm tra định dạng Email
    if (!validateEmail(emailElement.value)) {
      // Hiển thị lỗi lên.
      emailError.style.display = "block";
      emailError.innerHTML = "** Email không đúng định dạng.";
    }
  }
  if (!passwordElement.value) {
    // Hiển thị lỗi lên.
    passwordError.style.display = "block";
  } else {
    // Ẩn lỗi đi.
    passwordError.style.display = "none";
    // Kiểm tra mật khẩu tối thiểu 8 ký tự
    const newPassword = passwordElement.value.trim();
    if (newPassword.length < 8) {
      passwordError.style.display = "block";
      passwordError.innerHTML = "** Mật khẩu phâi it nhât 8 ký tự.";
    }
  }
  if (!confirmElement.value) {
    // Hiển thị lỗi lên.
    confirmError.style.display = "block";
  } else {
    // Ẩn lỗi đi.
    confirmError.style.display = "none";
    // Kiểm tra mật khẩu tối thiểu 8 ký tự
    const newConfirm = confirmElement.value.trim();
    if (newConfirm.length < 8) {
      confirmError.style.display = "block";
      confirmError.innerHTML = "** Mật khẩu phâi it nhât 8 ký tự.";
    }
  }
  // Kiểm tra mật khẩu có trùng nhau không.
  if (passwordElement.value !== confirmElement.value) {
    confirmError.style.display = "block";
    confirmError.innerHTML =
      "** Mật khẩu không trùng nhau , Vui lòng nhập lại !!";
  }
  if (!agreeElement.checked) {
    agreeError.style.display = "block";
  } else {
    agreeError.style.display = "none";
  }
  // Gủi dứ liệu từ form len LocalStorage.
  if (
    surnameElement.value &&
    usernameElement.value &&
    emailElement.value &&
    passwordElement.value &&
    confirmElement.value &&
    passwordElement.value === confirmElement.value &&
    validateEmail(emailElement.value) &&
    agreeElement.checked
  ) {
    //Lấy dứ liệu từ form va gộp thành user
    const user = {
      userId: Math.ceil(Math.random() * 100),
      surname: surnameElement.value,
      username: usernameElement.value,
      email: emailElement.value,
      password: passwordElement.value,
      confirm: confirmElement.value,
    };
    //push dứ liệu vào userLocal
    userLocal.push(user);
    //Luu trữ dữ liệu lên local
    localStorage.setItem("users", JSON.stringify(userLocal));
    // Đăng ký thành công
    alert("Đăng ký thành công 🎉");
    setTimeout(function () {
      //Chuyển huóng về trang đang nhập.
      window.location.href = "login.html";
    }, 1000);
  }
});

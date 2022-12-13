const apiURL = "https://distinct-deer-tuxedo.cyclic.app/api/";

import testLogin from "./login_page.json" assert { type: "json" };

const userNameInput = document.querySelector(".user--name");
const userPasswordInput = document.querySelector(".user--password");
const submit = document.querySelector(".form--submit");
const loginValue = document.querySelector(".login_value");

let userName, userPassword, currentAccount;

submit.addEventListener("click", function (e) {
  e.preventDefault();

  userName = userNameInput.value;
  userPassword = userPasswordInput.value;

  currentAccount = testLogin.user.find(
    (user) => user.userName === userName && user.password === userPassword
  );

  //----------------------------------------/
  if (userName && userPassword) {
    let doctors;
    const getDoctors = function () {
      fetch(apiURL + "doctors/login", {
        method: "POST",
        body: JSON.stringify({
          "email": `${userName}`,
          "password": `${userPassword}`,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(JSON.stringify(response));
          doctors = response;

          console.log(doctors.status);

          if (doctors.status === "success") {
            localStorage.setItem("userToken", doctors.token);

            console.log(doctors.data._id);
            window.open("./index.html", "_parent");
          } else if (doctors.status === "fail") {
            loginValue.textContent =
              "اسم المستخدم وكلمة المرور اللذان أدخلتهما لا يتطابقان مع سجلاتنا. يرجى التحقق مرة أخرى والمحاولة مرة أخرى.";
          }
        });
    };
    getDoctors();
  } else {
    loginValue.textContent = "الرجاء إدخال اسم المستخدم وكلمة المرور";
  }
});

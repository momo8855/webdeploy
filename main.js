const apiURL = "https://distinct-deer-tuxedo.cyclic.app/api/";

const userToken = localStorage.getItem("userToken");

//check if user make login before open page
if (!userToken) {
  window.open("./login.html", "_parent");
}

/*------------------QUERY VAR---------------------*/
const generatLecDetalis = document.querySelector(".create-lec--details");
const generatLecDate = document.querySelector(".create-lec--date--create");
const subject = document.querySelector(".subject");
const lec = document.querySelector(".lec");
const popup = document.querySelector(".popup--contaier--add-lec");
const subjectList = document.querySelector(".subject--list");
// popup subject
const popupSubject = document.querySelector(".popup--contaier--add-subject");
const popupSubjectInput = document.querySelector(".create-subject--name");
const subjectsItems = document.querySelector(".subjects--items");
const dateOfCreateSbject = document.querySelector(
  ".create-subject--date-modefied__value"
);
//click any subject in all of subjects (جميع المواد)
const item = document.querySelectorAll(".item");
const subjectHeader = document.querySelector(".subject--header");
//doctor
const doctoerNamePage = document.querySelector(".sidebar--professor-name");
//lecture
const lecDescription = document.querySelector(".lec-name--subname");
const lecNumber = document.querySelector(".lec--title--number");
const lecDate = document.querySelector(".lec-history--number");
const lecSection1 = document.querySelector(".section1");
const lecSection2 = document.querySelector(".section2");
const overViewHeader = document.querySelector(".general-lec-title--header");

// buttons
const btnGeneratLec = document.querySelector(".subject--button-generat");
const btnCancelLec = document.querySelector(".button__cancel");
const btnGenerate = document.querySelector(".button__generate");
//popup subject button
const btnAddSubject = document.querySelector(".subjects--button");
const btnAddSubjectInside = document.querySelector(".button__add-subject");
const btnCancelSubjectInside = document.querySelector(".button__cancel-sbject");
const btnGeneralLec = document.querySelector(".subject--button-general");
const btnZoomImg = document.querySelector(".lec-QR--zoom__QR");

//styles
const overlay = document.querySelector(".overlay");

//table
const studentTable = document.querySelector(".student--table");
const studentTableBody = document.querySelector(".student--table--body");
const tbodyOverView = document.querySelector(".body--general--table--tbody");

//imge
const qrSection = document.querySelector(".lec-QR");
const qrImg = document.querySelector(".lec-QR-img");
const zoomImgContainer = document.querySelector(".qrImg");
/*----------------------------------------------*/

/*------------------VARs---------------------*/
//variables needed
let currentDoctorData;
let currentDoctorName;
let currentDoctorId;
let doctorSubjects = [];
let currentSubjectId;
let currentLectureId;
let counterNumberOfLecs;
let currentLectureDescription;
/*----------------------------------------------*/

/*------------------FUNCTIONS---------------------*/
//#function get clicked subject
const currentLec = function (subjectTitle) {
  currentSubjectId = doctorSubjects.find((x) => x.title === subjectTitle)._id;
};

//#function for time now
const timeNow = function () {
  let time = new Date();
  const day = `${time.getDate()}`.padStart(2, 0);
  const month = `${time.getMonth() + 1}`.padStart(2, 0);
  const year = time.getFullYear();
  return `${day}-${month}-${year}`;
};

//#function change style when user click subject in sidebar
const changeFoucsInItem = function (sub) {
  document.querySelectorAll(".item").forEach((item) => {
    item.style.background = "#0468bf";
    item.style.color = "#fff";
  });

  subjectHeader.textContent = sub.innerText;
  sub.style.background = "#fff";
  sub.style.color = "#000";
};

//#function generate qr (toke id of lecture)
const generateQR = function (id, w, h) {
  document.querySelector(".zoomImg").innerHTML = ``;

  qrImg.innerHTML = ``;
  console.log("qr Id", id);
  let qrcode = new QRCode("qrcode", {
    width: w,
    height: h,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  qrcode.makeCode(id);
};
/*----------------------------------------------*/

/*------------------DOCTOR----------------------*/
//# get doctor data
const getDoctorData = function () {
  fetch(apiURL + "doctors/me", {
    method: "GET",
    headers: {
      "authorization": "Bearer " + userToken,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("get doctor data response: ", response);

      currentDoctorData = response.data;
      currentDoctorName = response.data.name;
      currentDoctorId = response.data._id;

      doctoerNamePage.textContent = "د. " + response.data.name;
    });
};
getDoctorData();
/*----------------------------------------------*/

/*------------------SUBJECT---------------------*/
//#handel subjects function
const handelSubject = function (dataSubjects) {
  subjectsItems.innerHTML = ``;
  const addSubject = function () {
    dataSubjects.forEach((item) => {
      let addLi = document.createElement("li");
      subjectsItems.append(addLi);
      addLi.classList.add("item");

      addLi.textContent = `${item.title}`;

      //save doctors subjects in array to used it later
      doctorSubjects.push(item);
    });
  };
  addSubject();
};

//# get all subjects (for the same user Id)
const getSubjects = function () {
  fetch(apiURL + "subjects?limit=1000", {
    method: "GET",
    headers: {
      "authorization": "Bearer " + userToken,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      response = response.data.filter((x) => x.doctorId == currentDoctorId);

      handelSubject(response);
      console.log("subjects data: ", response);
      clickSubject();
    });
};
getSubjects();

//# popup of add subject
const hidePopupSubject = function () {
  popupSubjectInput.value = "";
};

const closePopup = function () {
  popupSubject.classList.add("hidden");
  overlay.classList.add("hidden");
};

overlay.addEventListener("click", () => {
  closePopup();
  hidePopup();
  currentLectureId && closeZoomImg();
});

//  (اضافة مادة)
btnAddSubject.addEventListener("click", function () {
  popupSubject.classList.remove("hidden");
  overlay.classList.remove("hidden");

  dateOfCreateSbject.textContent = timeNow();
});

//  (اضافة مادة)  ---->  (إلغاء)
btnCancelSubjectInside.addEventListener("click", function () {
  closePopup();
  hidePopupSubject(); //when user click cancel (remove the text)
});

//   (اضافة مادة)  ---->  (إضافة)
btnAddSubjectInside.addEventListener("click", function () {
  let popup_subject__input__value = popupSubjectInput.value;
  if (popup_subject__input__value) {
    //create subject add send to database
    const getDoctors = function () {
      fetch(apiURL + "subjects/", {
        method: "POST",
        body: JSON.stringify({
          "title": `${popup_subject__input__value}`,
          "doctorId": currentDoctorId,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorization": "Bearer " + userToken,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(JSON.stringify(response));
          console.log(response);

          getSubjects();
        });
    };
    getDoctors();

    closePopup();
    hidePopupSubject();
  }
});
/*----------------------------------------------*/

/*-----------------ATTENDANCES--------------------*/
//#GET Attendance for lecure using lec ID
const getAttendanceForLec = function (id) {
  fetch(apiURL + `attendances/lectures/${id}?limit=1000`, {
    method: "GET",
    headers: {
      "authorization": "Bearer " + userToken,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("attendance for lecture id: ", response);

      //to delete last tr in the table
      let tbody = document.querySelector(".student--table--body");
      tbody && (tbody.textContent = "");

      //If there is no student dont run addTable()
      response.data && addTable(response.data.students);
    });
};
/*-----------------------------------------------*/

//#click zoom img
const clickZoomImg = function (currentLectureId) {
  btnZoomImg.addEventListener("click", function () {
    console.log("zomm img clicked");

    qrImg.removeAttribute("id");
    document.querySelector(".zoomImg").setAttribute("id", "qrcode");

    generateQR(currentLectureId, 800, 800);
    overlay.classList.remove("hidden");
  });
};

const closeZoomImg = function () {
  document.querySelector(".zoomImg").removeAttribute("id");
  qrImg.setAttribute("id", "qrcode");
  generateQR(currentLectureId, 150, 150);
};

/*---------------------LEC----------------------*/
//# GET specific lec
const getSpecificLec = function (idLec) {
  fetch(apiURL + "lectures/" + idLec, {
    method: "GET",
    headers: {
      "authorization": "Bearer " + userToken,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("get specific lec with id response: ", response);
      currentLectureDescription = response.data.description;
      lecDate.textContent = response.data?.createdAt?.slice(0, 10);
      console.log("description of lecture is: ", response.data.description);
      console.log(currentLectureDescription);

      //problem id = 234242 (must be above not heare)
      lecDescription.textContent =
        currentLectureDescription || "أنت لم تدخل وصف لهذه المحاضرة";
    });
};

const displayLecData = function (date, number) {
  lecNumber.textContent = number;
  // lecDate.textContent = date;
  //problem id = 234242 (must be heare)

  getSpecificLec(currentLectureId);
};

const clickLecStyle = function (clickedLec, _lec) {
  //to display section2
  document.querySelector(".lec").classList.remove("hidden");

  //come from (نظرة عامة)
  lecSection1.classList.remove("hiddenSection");
  lecSection2.classList.add("hiddenSection");

  //remove focuse from general over view
  btnGeneralLec.style.background = "#fff";
  btnGeneralLec.style.border = "solid #fff 2px";

  //for make focuse style on clicked lec
  _lec.forEach((lecStyle) => (lecStyle.style.background = "#fff"));
  clickedLec.style.background = "#d4d4d4";
};

const clickLec = function () {
  const lec = document.querySelectorAll(".subject--lec");

  lec.forEach((item) => {
    item.addEventListener("click", function () {
      console.log("click lec --> lec id: ", this.id);
      currentLectureId = this.id;
      console.log("click lec: ", this);

      let num = this.querySelector(".subject--lec--number").textContent;
      let date = this.querySelector(".subject--lec--date").textContent;

      displayLecData(date, num);
      generateQR(currentLectureId, 150, 150); //see it later

      clickZoomImg(currentLectureId);

      clickLecStyle(this, lec);

      //get attendance for lec
      getAttendanceForLec(currentLectureId);
    });
  });
};

//# make temblet html model using dom
const addLec = function (id, number, date) {
  let lecConatiner = document.createElement("li");
  subjectList.append(lecConatiner);

  lecConatiner.className = "subject--lec";
  lecConatiner.setAttribute("id", id);

  lecConatiner.innerHTML = `
  <h1>المحاضرة</h1>
  <p class="subject--lec--number">${number}</p>
  <p class="subject--lec--date">${date}</p>`;
};

//# get all lectures (for the same subject Id)
const getLectures = function () {
  fetch(apiURL + "lectures?limit=1000", {
    method: "GET",
    headers: {
      "authorization": "Bearer " + userToken,
    },
  })
    .then((response) => response.json())
    .then(lec.classList.add("hidden"))
    .then((response) => {
      response = response.data.filter((x) => x.subjectId == currentSubjectId);

      counterNumberOfLecs = response.length;
      console.log("all subject lectures", response);

      subjectList.innerHTML = ``;
      response.forEach((lec) => {
        addLec(lec._id, lec.numberOfLec, lec.dateOfStart.slice(0, 10));
      });

      //remove hidden style from lec abd subjec section when click on the subject
      subject.classList.remove("hidden");

      clickLec();
    });
};

//? solved but in tricky way
//click any subject in all of subjects (جميع المواد)
const clickSubject = function () {
  document.querySelectorAll(".item").forEach((item) =>
    item.addEventListener("click", function () {
      console.log("click on subject : ", this.innerText);

      changeFoucsInItem(this);

      currentLec(this.textContent);

      getLectures();

      overViewHeader.textContent = this.innerText;
    })
  );
};

//# POST lec to database
const postLec = function (description, date) {
  fetch(apiURL + "lectures/", {
    method: "POST",
    body: JSON.stringify({
      "title": "not now",
      "numberOfLec": counterNumberOfLecs + 1,
      "dateOfStart": date,
      "subjectId": currentSubjectId,
      "description": description,
      //ADD doctor id
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "authorization": "Bearer " + userToken,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(JSON.stringify(response));
      console.log(response);

      getLectures();
    });
};

//# popup of generate lec
const hidePopup = function () {
  popup.classList.add("hidden");
  overlay.classList.add("hidden");
};

const hidePopupLec = function () {
  generatLecDetalis.value = "";
  generatLecDate.value = "";
};

//  (إنشاء محاضرة)
btnGeneratLec.addEventListener("click", function () {
  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");

  document.querySelector(".create-lec--number__num").textContent =
    counterNumberOfLecs + 1;
});

//  (إنشاء محاضرة) --> (إلغاء)
//! I used trick to solve this problem
btnCancelLec.addEventListener("click", () => {
  hidePopup(popup);
  hidePopupLec();
});

//  (إنشاء محاضرة) --> (إنشاء)
btnGenerate.addEventListener("click", function () {
  let lecDetalis = generatLecDetalis.value;
  let lecDate = generatLecDate.value;

  if (lecDetalis && lecDate) {
    postLec(lecDetalis, lecDate);

    hidePopup(popup);
  }
});

//# click general veiw (نظرة عامة)
const generalLecStyles = function (btn) {
  //display section2
  lec.classList.remove("hidden");

  //add style foucse when clicked btn
  btn.style.background = "#d4d4d4";
  btn.style.border = "solid #707070 2px";

  //display generalLec section and hide lecAttendance section
  lecSection1.classList.add("hiddenSection");
  lecSection2.classList.remove("hiddenSection");

  //for make focuse style on clicked lec
  document
    .querySelectorAll(".subject--lec")
    .forEach((lecStyle) => (lecStyle.style.background = "#fff"));
};

btnGeneralLec.addEventListener("click", function () {
  generalLecStyles(this);

  //delete old data before get new data
  tbodyOverView.innerHTML = ``;

  const getAttendancForSubject = function (id) {
    fetch(apiURL + `students/attendances/subjects/${id}`, {
      method: "GET",
      headers: {
        "authorization": "Bearer " + userToken,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("getAttendancForSubject data: ", response);

        response.data.forEach((std) => {
          let tr = document.createElement("tr");
          tbodyOverView.append(tr);

          tr.innerHTML = `
            <td>${std.sittingNumber}</td>
            <td class="dir">${std.name}</td>
            <td>${std.department}</td>
            <td>${std.division}</td>
            <td>${std.level}</td>
            <td>${std.numLecturesAttended}</td>`;
        });
      });
  };
  getAttendancForSubject(currentSubjectId);
});

/*----------------------------------------------*/

/*------------------STUDENT---------------------*/
//# add student data in table
const addTable = function (dataStudents) {
  dataStudents.forEach((std) => {
    let tableRow = document.createElement("tr");

    studentTableBody.append(tableRow);

    //! <lec> does not exist in api
    //Wait data from api
    //#GET student data with api
    const getDataSpecificStudents = function (id) {
      fetch(apiURL + `students/${id}`, {
        method: "GET",
        headers: {
          "authorization": "Bearer " + userToken,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          // addTable(response.data);
          console.log("getDataSpecificStudents response: ", response);

          tableRow.innerHTML = `
        <td>✅</td>
        <td>${response.data.level}</td>
        <td>${response.data.division || "غير مدرج"}</td>
        <td>${response.data.department || "غير مدرج"}</td>
        <td>${response.data.name}</td>`;
        });
    };
    getDataSpecificStudents(std._id);

    // <td>${std.idNumber}</td>
  });
};

/*----------------------------------------------*/
// document.querySelector(".zoomImg").innerHTML =

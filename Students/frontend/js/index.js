const SERVER_URL = "http://localhost:3000";

async function serverAddSudent(obj) {
  let response = await fetch(SERVER_URL + "/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });

  let data = await response.json();

  return data;
}

async function serverGetSudents() {
  let response = await fetch(SERVER_URL + "/api/students", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  let data = await response.json();

  return data;
}

async function serverDeleteSudent(id) {
  let response = await fetch(SERVER_URL + "/api/students/" + id, {
    method: "DELETE",
  });

  let data = await response.json();

  return data;
}

let serverData = await serverGetSudents();
// let listStudents = [{
//         name: 'Илья',
//         lastname: "Иванов",
//         surname: "Олегович",
//         birthday: new Date(1994, 5, 12),
//         faculty: "Экономика",
//         studyStart: 2010,
//     },
//     {
//         name: 'Оля',
//         lastname: "Студентова",
//         surname: "Александровна",
//         birthday: new Date(1991, 11, 18),
//         faculty: "Экономика",
//         studyStart: 2011,
//     }, {
//         name: 'Татьяна',
//         lastname: "Иванова",
//         surname: "Олеговеа",
//         birthday: new Date(1997, 4, 1),
//         faculty: "Информатика",
//         studyStart: 2016,
//     }
// ]

let listStudents = [];

if (serverData) {
  listStudents = serverData;
}

function formatDate(date) {
  var dd = date.getDate();
  if (dd < 10) dd = "0" + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;

  var yy = date.getFullYear();
  if (yy < 10) yy = "0" + yy;

  return dd + "." + mm + "." + yy;
}

function $getNewStudentTR(studObj) {
  const $tr = document.createElement("tr");
  const $tdFIO = document.createElement("td");
  const $tdBirthday = document.createElement("td");
  const $tdfaculty = document.createElement("td");
  const $tdStudyStart = document.createElement("td");
  const $tdDelete = document.createElement("td");
  const $btnDelete = document.createElement("button");

  $btnDelete.classList.add("btn", "btn-danger", "w-100");
  $btnDelete.textContent = "Удалить";

  $tdFIO.textContent = `${studObj.lastname} ${studObj.name} ${studObj.surname}`;
  $tdBirthday.textContent = formatDate(new Date(studObj.birthday));
  $tdfaculty.textContent = studObj.faculty;
  $tdStudyStart.textContent = studObj.studyStart;

  $btnDelete.addEventListener("click", async function () {
    await serverDeleteSudent(studObj.id);
    $tr.remove();
  });

  $tdDelete.append($btnDelete);
  $tr.append($tdFIO, $tdBirthday, $tdfaculty, $tdStudyStart, $tdDelete);
  return $tr;
}

function redner(arr) {
  let copyArr = [...arr];

  const $studTable = document.getElementById("stud-table");

  $studTable.innerHTML = "";
  for (const studObj of copyArr) {
    const $newTr = $getNewStudentTR(studObj);
    $studTable.append($newTr);
  }
}

redner(listStudents);

// document
//   .getElementById("add-form")
//   .addEventListener("submit", async function (event) {
//     event.preventDefault();

//     let newStudentObj = {
//       name: document.getElementById("name-inp").value,
//       lastname: document.getElementById("lastname-inp").value,
//       surname: document.getElementById("surname-inp").value,
//       birthday: new Date(document.getElementById("birthday-inp").value),
//       faculty: document.getElementById("faculty-inp").value,
//       studyStart: document.getElementById("studyStart-inp").value,
//     };

//     let serverDataObj = await serverAddSudent(newStudentObj);

//     serverDataObj.birthday = new Date(serverDataObj.birthday);

//     listStudents.push(serverDataObj);

//     console.log(listStudents);
//     redner(listStudents);
//   });
document
  .getElementById("add-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Получаем значения полей формы
    let name = document.getElementById("name-inp").value.trim();
    let lastname = document.getElementById("lastname-inp").value.trim();
    let surname = document.getElementById("surname-inp").value.trim();
    let birthday = new Date(document.getElementById("birthday-inp").value);
    let faculty = document.getElementById("faculty-inp").value.trim();
    let studyStart = document.getElementById("studyStart-inp").value.trim();

    // Проверка наличия значений в полях
    if (
      name === "" ||
      lastname === "" ||
      surname === "" ||
      faculty === "" ||
      studyStart === ""
    ) {
      alert("Пожалуйста, заполните все поля.");
      return; // Останавливаем отправку формы
    }

    // Проверка корректности формата даты рождения
    if (isNaN(birthday.getTime())) {
      alert("Пожалуйста, введите корректную дату рождения.");
      return; // Останавливаем отправку формы
    }

    // Валидация успешна, создаем объект студента и отправляем на сервер
    let newStudentObj = {
      name: name,
      lastname: lastname,
      surname: surname,
      birthday: birthday,
      faculty: faculty,
      studyStart: studyStart,
    };

    let serverDataObj = await serverAddSudent(newStudentObj);

    // Обработка ответа от сервера и обновление списка студентов
    serverDataObj.birthday = new Date(serverDataObj.birthday);
    listStudents.push(serverDataObj);
    redner(listStudents);
  });
//////////////////////////////////////////////////////////////////////////
async function searchStudents(query) {
  try {
    const response = await fetch(
      `${SERVER_URL}/api/students?search=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data); // Вывод результатов поиска в консоль

    const tableBody = document.getElementById("stud-table");
    tableBody.innerHTML = "";

    // Обновляем таблицу с найденными студентами
    for (const student of data) {
      const $newTr = $getNewStudentTR(student);
      tableBody.appendChild($newTr);
    }
    // Дальнейшая обработка результатов поиска...
  } catch (error) {
    console.error("Error searching students:", error);
  }
}

// Пример использования функции searchStudents
// searchStudents("it");

// Событие для обработки отправки формы поиска
document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const searchText = document.getElementById("search").value.trim(); // Получаем текст из поля поиска
    searchStudents(searchText); // Выполняем поиск
  });
/////////////////////////////////////////////////////////////////////////

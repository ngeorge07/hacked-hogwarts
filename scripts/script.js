"use strict";
import fetchData from "./clean-script.js";

fetch("https://petlatkea.dk/2021/hogwarts/students.json")
  .then((response) => response.json())
  .then(passFunction);

let hufflepuffPrefects = 0;
let gryffindorPrefects = 0;
let ravenclawPrefects = 0;
let slytherinPrefects = 0;

function passFunction(students) {
  const allData = fetchData(students);
  const filterDropDown = document.querySelector("#filter");

  showData(allData);
  addSortButtons(allData);
  addSearch(allData);

  filterDropDown.addEventListener("change", () => {
    const selectedFilter = filterDropDown.value;
    if (filterDropDown.value === "all") {
      removeData();
      showData(allData);
      addSortButtons(allData);
      addSearch(allData);
    } else {
      filter(selectedFilter, allData);
      addSortButtons(filter(selectedFilter, allData));
      addSearch(filter(selectedFilter, allData));
    }
  });
}

function searchCondition(input, data) {
  const searchedData = data.filter((student) => {
    let result;

    if (!student.last_name && !student.middle_name) {
      result = student.first_name
        .toUpperCase()
        .includes(input.value.toUpperCase());
    } else if (!student.middle_name) {
      result =
        student.first_name.toUpperCase().includes(input.value.toUpperCase()) ||
        student.last_name.toUpperCase().includes(input.value.toUpperCase());
    } else
      result =
        student.first_name.toUpperCase().includes(input.value.toUpperCase()) ||
        student.middle_name.toUpperCase().includes(input.value.toUpperCase()) ||
        student.last_name.toUpperCase().includes(input.value.toUpperCase());

    return result;
  });

  showData(searchedData);
  addSortButtons(searchedData);
}

function addSearch(data) {
  const searchInput = document.querySelector("#search");

  searchInput.addEventListener("input", () => {
    searchCondition(searchInput, data);
  });
}

function addSortButtons(data) {
  document.querySelector("#firstAZ").addEventListener("click", () => {
    if (document.querySelector("#firstAZ").checked) {
      sort("first_name", data, 1);
    }
  });

  document.querySelector("#firstZA").addEventListener("click", () => {
    if (document.querySelector("#firstZA").checked) {
      sort("first_name", data, -1);
    }
  });

  document.querySelector("#lastAZ").addEventListener("click", () => {
    if (document.querySelector("#lastAZ").checked) {
      sort("last_name", data, 1);
    }
  });

  document.querySelector("#lastZA").addEventListener("click", () => {
    if (document.querySelector("#lastZA").checked) {
      sort("last_name", data, -1);
    }
  });
}

function sort(sortBy, data, direction) {
  data = data.sort(sortByProperty);

  function sortByProperty(a, b) {
    if (a[sortBy] < b[sortBy]) {
      return -1 * direction;
    }
    if (a[sortBy] > b[sortBy]) {
      return 1 * direction;
    }
    return 0;
  }

  showData(data);
}

function filter(condition, data) {
  const filteredData = data.filter((student) => student.house === condition);
  removeData();
  showData(filteredData);

  return filteredData;
}

function showData(students) {
  removeData();
  students.forEach((student) => {
    const studentTemp = document.querySelector("#student-template").content;
    const studentClone = studentTemp.cloneNode("true");
    const btn = studentClone.querySelector(".first-name");

    const firstName = studentClone.querySelector(".first-name");
    const middleName = studentClone.querySelector(".middle-name");
    const lastName = studentClone.querySelector(".last-name");
    const house = studentClone.querySelector(".house");

    if (student.squad) {
      studentClone.querySelector(".umbridge").classList.remove("dolores-gray");
    } else
      studentClone.querySelector(".umbridge").classList.add("dolores-gray");

    studentClone.querySelector(".inq").addEventListener("click", () => {
      if (student.squad) {
        student.squad = false;
      } else student.squad = true;

      showData(students);
    });

    if (student.prefect) {
      studentClone.querySelector(".prefect").textContent = "⭐";
    } else studentClone.querySelector(".prefect").textContent = "☆";

    studentClone.querySelector(".prefect").addEventListener("click", () => {
      if (student.house === "Hufflepuff") {
        hufflepuffPrefects = countPrefects(hufflepuffPrefects);
      } else if (student.house === "Gryffindor") {
        gryffindorPrefects = countPrefects(gryffindorPrefects);
      } else if (student.house === "Slytherin") {
        slytherinPrefects = countPrefects(slytherinPrefects);
      } else ravenclawPrefects = countPrefects(ravenclawPrefects);

      showData(students);
    });

    function countPrefects(prefectPerHouse) {
      if (student.prefect) {
        student.prefect = false;
        prefectPerHouse = prefectPerHouse - 1;
      } else {
        prefectPerHouse = prefectPerHouse + 1;
        if (prefectPerHouse > 2) {
          window.alert("Can't assign any other prefects");
          prefectPerHouse = prefectPerHouse - 1;
          student.prefect = false;
        } else student.prefect = true;
      }

      return prefectPerHouse;
    }

    firstName.textContent = student.first_name;
    middleName.textContent = student.middle_name;
    lastName.textContent = student.last_name;
    house.textContent = student.house;

    btn.addEventListener("click", () => {
      const popTemp = document.querySelector("#pop").content;
      const popClone = popTemp.cloneNode(true);
      const modal = popClone.getElementById("myModal");
      const span = popClone.querySelector(".close");

      const modalFullName = popClone.querySelector("#modal-fullname");
      const modalFirst = popClone.querySelector("#modal-first");
      const modalMiddle = popClone.querySelector("#modal-middle");
      const modalLast = popClone.querySelector("#modal-last");
      const modalNick = popClone.querySelector("#modal-nick");
      const modalHouse = popClone.querySelector("#modal-house");
      const modalBlood = popClone.querySelector("#modal-blood");
      const modalInq = popClone.querySelector("#modal-inq");
      const modalImg = popClone.querySelector("#modal-img");

      modal.style.display = "block";

      span.onclick = function () {
        modal.remove();
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.remove();
        }
      };

      modalFullName.textContent = checkNames(
        student.first_name,
        student.middle_name,
        student.last_name
      ).fullName;

      modalFirst.textContent = `First name: ${student.first_name}`;
      modalMiddle.textContent = `Middle name: ${
        checkNames(student.first_name, student.middle_name, student.last_name)
          .middleName
      }`;
      modalLast.textContent = `Last name: ${
        checkNames(student.first_name, student.middle_name, student.last_name)
          .lastName
      }`;
      modalNick.textContent = `Nickname: ${
        checkNames(
          student.first_name,
          student.middle_name,
          student.last_name,
          student.nick_name
        ).nickName
      }`;

      modalHouse.textContent = `House: ${student.house}`;
      modalBlood.textContent = `Blood: ${student.blood}`;
      modalImg.src = student.image;

      if (student.squad) {
        modalInq.textContent = "Inquisitorial squad: Yes";
      } else modalInq.textContent = "Inquisitorial squad: No";

      document.querySelector("tbody").appendChild(popClone);
    });

    document.querySelector("tbody").appendChild(studentClone);
  });
}

function checkNames(first, middle, last, nick) {
  let fullName;
  let middleName;
  let lastName;
  let nickName;

  if (!middle) {
    if (!last) {
      fullName = first;
      lastName = "N/A";
    } else {
      fullName = `${first} ${last}`;
      lastName = last;
    }

    middleName = "N/A";
  } else {
    middleName = middle;
    fullName = `${first} ${middle} ${last}`;
    lastName = last;
  }

  if (!nick) {
    nickName = "N/A";
  } else {
    nickName = nick;
  }

  return { fullName, middleName, lastName, nickName };
}

function removeData() {
  let parent = document.querySelector("tbody");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

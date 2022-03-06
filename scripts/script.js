"use strict";
import fetchData from "./clean-script.js";

// Counting all the houses form all students, and looking at the lenght of allStudents, expelledList and students.

fetch("https://petlatkea.dk/2021/hogwarts/students.json")
  .then((response) => response.json())
  .then(passFunction);

let hufflepuffPrefects = 0;
let gryffindorPrefects = 0;
let ravenclawPrefects = 0;
let slytherinPrefects = 0;

let isHacked = false;
let inqRemoved = false;
let g;
let h;
let r;
let s;

let totalNumberStudents;
let expelledStudents = [];

const displayGryffindorCounter = document.querySelector("#gryffindor-counter");
const displayHufflepuffCounter = document.querySelector("#hufflepuff-counter");
const displayRavenclawCounter = document.querySelector("#ravenclaw-counter");
const displaySlytherinCounter = document.querySelector("#slytherin-counter");

async function passFunction(students) {
  let hackTrigger = 0;
  const allData = await fetchData(students);

  document.querySelector("#secret-trigger").addEventListener("click", () => {
    hackTrigger++;

    if (hackTrigger === 3) {
      document.querySelector(".hack-button").classList.add("hack-visible");
    }
  });

  totalNumberStudents = students.length;
  g = studentCounter(allData).Gryffindor;
  h = studentCounter(allData).Hufflepuff;
  r = studentCounter(allData).Ravenclaw;
  s = studentCounter(allData).Slytherin;

  // displayCount(studentCounter(allData));

  showData(allData);
  addSortButtons(allData);
  addSearch(allData);

  const showAllStudents = document.querySelector("#show-all");
  showAllStudents.addEventListener("click", () => {
    filterDropDown.value = "all";
    addSortButtons(allData);
    showData(allData);
  });

  const filterDropDown = document.querySelector("#filter");
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

  window.hackTheSystem = hackTheSystem;

  document
    .querySelector(".hack-button")
    .addEventListener("click", hackTheSystem);

  function hackTheSystem() {
    if (!isHacked) {
      const audio = document.querySelector("audio");
      audio.play();
      document.querySelector("#hacking-system").style.display = "block";

      document.querySelector(".hack-button").classList.remove("hack-visible");

      const Me = {
        first_name: "Nicholas",
        nick_name: "Sexy Cat",
        middle_name: "",
        last_name: "Cage",
        image: "https://www.placecage.com/114/108",
        gender: "bad boy",
        house: "Hufflepuff",
        blood: "pure",
        squad: false,
        prefect: false,
        status: false,
        expelled: false,
        me: true,
      };

      let text = document.querySelector("#hack-text").innerText;
      let origin = document.querySelector("#hack-text");

      origin.innerHTML = "";

      const textArray = [];

      for (let i = 0; i < text.length; i++) {
        textArray.push(text.charAt(i));
      }

      let e = 0;

      function typewriter() {
        if (e < textArray.length) {
          origin.innerHTML += textArray[e];
          setTimeout(typewriter, 100);
          e++;
        } else {
          setTimeout(() => {
            document.querySelector("#hacking-system").style.display = "none";
            audio.pause();
            audio.currentTime = 0;
            removeInq(allData);
          }, 1800);
        }
      }
      typewriter();

      randomizeBlood(allData);

      // setTimeout(() => {
      // }, 4800);

      allData.unshift(Me);
      totalNumberStudents++;
      h++;

      showData(allData);

      isHacked = true;
    } else return;
  }
}

function studentCounter(students) {
  const countStudents = {
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0,
  };

  students.forEach((student) => {
    countStudents[student.house]++;
  });

  return countStudents;
}

function randomizeBlood(data) {
  data.forEach((student) => {
    if (student.me) {
      return;
    }

    if (student.initialPure) {
      let randomBlood = Math.floor(Math.random() * 3);
      if (randomBlood === 0) {
        student.blood = "half";
      } else if (randomBlood === 1) {
        student.blood = "muggle";
      } else if (randomBlood === 2) {
        student.blood = "pure";
      }
    } else student.blood = "pure";
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
    if (
      (searchInput.value === "hary" || searchInput.value === "Hary") &&
      !isHacked
    ) {
      searchInput.value = "";
      // hackTheSystem();
      document.querySelector(".hack-button").classList.add("hack-visible");
    }

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
  // data = data.sort(sortByProperty);

  function sortByProperty(a, b) {
    if (b[sortBy] === null) {
      b[sortBy] = "zzz";
    }

    if (a[sortBy] === null) {
      a[sortBy] = "zzz";
    }

    if (a[sortBy] < b[sortBy]) {
      return -1 * direction;
    }
    if (a[sortBy] > b[sortBy]) {
      return 1 * direction;
    }
    return 0;
  }

  showData(data.sort(sortByProperty));
}

function removeInq(data) {
  data.forEach((student) => {
    if (student.squad) {
      student.squad = false;
    }
  });

  document.querySelector("#cant-squad").style.display = "grid";
  displayErrorModal("No more inquisitorial squad! Cool. Cool, cool, cool.");
  setTimeout(() => {
    document.querySelector("#cant-squad").style.display = "none";
    document.querySelector("#customModal").style.display = "none";
  }, 3500);

  showData(data);
}

function filter(condition, data) {
  const filteredData = data.filter((student) => student.house === condition);
  showData(filteredData);

  return filteredData;
}

function displayErrorModal(text) {
  const customModal = document.querySelector("#customModal");
  const span = document.querySelector(".close");

  customModal.style.display = "block";

  customModal.querySelector("p").textContent = text;

  span.onclick = function () {
    customModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === customModal) {
      customModal.style.display = "none";
    }
  };
}

function showData(students, isExpelled) {
  removeData();

  if (isHacked) {
    randomizeBlood(students);
  }

  // displayCount(studentCounter(students));

  const expelledStudentsCounter = document.querySelector("#expelled-counter");
  const enrolledStudentsCounter = document.querySelector("#enrolled-counter");
  const displayedStudentsCounter = document.querySelector("#displayed-counter");

  expelledStudentsCounter.textContent = `Expelled students: ${expelledStudents.length}`;
  enrolledStudentsCounter.textContent = `Enrolled students: ${
    totalNumberStudents - expelledStudents.length
  }`;

  displayGryffindorCounter.textContent = g;
  displayHufflepuffCounter.textContent = h;
  displayRavenclawCounter.textContent = r;
  displaySlytherinCounter.textContent = s;

  students.forEach((student) => {
    const studentTemp = document.querySelector("#student-template").content;
    const studentClone = studentTemp.cloneNode("true");
    const btn = studentClone.querySelector(".view-det");
    const showExpelled = document.querySelector("#show-expelled");

    const studentCard = studentClone.querySelector(".student-card");
    const studentFullName = studentClone.querySelector(".full-name");
    const studentCrest = studentClone.querySelector(".card-student-crest");
    const studentImage = studentClone.querySelector(".card-student-image");
    const studentGender = studentClone.querySelector(".card-gender");
    const studentBlood = studentClone.querySelector(".card-blood");

    if (student.status && !isExpelled) {
      studentCard.remove;
      return;
    }

    if (!student.last_name || student.last_name === "zzz") {
      studentFullName.textContent = `${student.first_name}`;
    } else
      studentFullName.textContent = `${student.first_name} ${student.last_name}`;
    studentGender.textContent = `Gender: ${student.gender}`;
    studentBlood.textContent = `Blood status: ${student.blood}`;

    if (student.image) {
      studentImage.src = student.image;
    } else {
      studentImage.src = "http://placekitten.com/108/114";
    }

    studentClone.querySelector(".inq").addEventListener("click", () => {
      if (student.squad) {
        student.squad = false;
      } else if (student.blood === "pure" || student.house === "Slytherin") {
        student.squad = true;
      } else {
        displayErrorModal(
          "Only pure blood students and Slytherins are allowed in the inquisitorial squad."
        );
      }

      showData(students);
    });

    if (student.squad) {
      if (isHacked) {
        setTimeout(() => {
          removeInq(students);
        }, 3000);
      }
      studentClone.querySelector(".umbridge").classList.remove("grayscale");
    } else studentClone.querySelector(".umbridge").classList.add("grayscale");

    if (student.prefect) {
      studentClone.querySelector(".prefect").classList.remove("grayscale");
    } else studentClone.querySelector(".prefect").classList.add("grayscale");

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
          displayErrorModal("Can't assign any other prefects in this house.");

          prefectPerHouse = prefectPerHouse - 1;
          student.prefect = false;
        } else student.prefect = true;
      }

      return prefectPerHouse;
    }

    if (student.house === "Gryffindor") {
      studentCard.classList.add("gryffindor-border");
      studentCrest.src = "../assets/house-crests/gryffindor.png";
    } else if (student.house === "Hufflepuff") {
      studentCard.classList.add("hufflepuff-border");
      studentCrest.src = "../assets/house-crests/hufflepuff.png";
    } else if (student.house === "Slytherin") {
      studentCard.classList.add("slytherin-border");
      studentCrest.src = "../assets/house-crests/slytherin.png";
    } else {
      studentCard.classList.add("ravenclaw-border");
      studentCrest.src = "../assets/house-crests/ravenclaw.png";
    }

    if (expelledStudents.includes(student)) {
      studentClone.querySelector(".inq").remove();
      studentClone.querySelector(".prefect").remove();

      student.prefect = false;
      student.squad = false;
    }

    btn.classList.add("ui-button");
    btn.addEventListener("click", () => {
      const popTemp = document.querySelector("#pop").content;
      const popClone = popTemp.cloneNode(true);
      const modal = popClone.getElementById("myModal");
      const span = popClone.querySelector(".close");

      const modalHeader = popClone.querySelector(".modal-header");

      const modalFullName = popClone.querySelector("#modal-fullname");
      const modalFirst = popClone.querySelector("#modal-first");
      const modalMiddle = popClone.querySelector("#modal-middle");
      const modalLast = popClone.querySelector("#modal-last");
      const modalNick = popClone.querySelector("#modal-nick");
      const modalHouse = popClone.querySelector("#modal-house");
      const modalCrest = popClone.querySelector("#modal-crest");
      const modalBlood = popClone.querySelector("#modal-blood");
      const modalInq = popClone.querySelector("#modal-inq");
      const modalPref = popClone.querySelector("#modal-prefect");
      const modalImg = popClone.querySelector("#modal-student-img");
      const modalExpelBtn = popClone.querySelector("#modal-expel");
      const modalStatus = popClone.querySelector("#modal-status");

      modal.style.display = "block";

      span.onclick = function () {
        modal.remove();
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.remove();
        }
      };

      modalHouse.textContent = `House: ${student.house}`;

      if (student.house === "Gryffindor") {
        modalHeader.classList.add("gryffindor-color");
        modalCrest.src = "../assets/house-crests/gryffindor.png";
      } else if (student.house === "Hufflepuff") {
        modalHeader.classList.add("hufflepuff-color");
        modalCrest.src = "../assets/house-crests/hufflepuff.png";
      } else if (student.house === "Slytherin") {
        modalHeader.classList.add("slytherin-color");
        modalCrest.src = "../assets/house-crests/slytherin.png";
      } else {
        modalHeader.classList.add("ravenclaw-color");
        modalCrest.src = "../assets/house-crests/ravenclaw.png";
      }

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

      // modalHouse.textContent = `House: ${student.house}`;
      modalBlood.textContent = `Blood: ${student.blood}`;
      if (student.image) {
        modalImg.src = student.image;
      } else modalImg.src = "http://placekitten.com/108/114";

      if (student.squad) {
        modalInq.textContent = "Inquisitorial squad: Yes";
      } else modalInq.textContent = "Inquisitorial squad: No";

      if (student.prefect) {
        modalPref.textContent = "Prefect: Yes";
      } else modalPref.textContent = "Prefect: No";

      modalExpelBtn.addEventListener("click", expelStudent);

      function expelStudent() {
        if (student.me) {
          document.querySelector("#cant-expel").style.display = "grid";
          setTimeout(() => {
            document.querySelector("#cant-expel").style.display = "none";
          }, 6500);
          return;
        }

        if (student.status) {
          student.status = false;
        } else student.status = true;

        if (student.house === "Gryffindor") {
          g--;
          if (gryffindorPrefects > 0) {
            gryffindorPrefects--;
          }
        } else if (student.house === "Ravenclaw") {
          r--;
          if (ravenclawPrefects > 0) {
            ravenclawPrefects--;
          }
        } else if (student.house === "Hufflepuff") {
          h--;
          if (hufflepuffPrefects > 0) {
            hufflepuffPrefects--;
          }
        } else {
          s--;
          if (slytherinPrefects > 0) {
            slytherinPrefects--;
          }
        }

        students.splice(students.indexOf(student), 1);
        expelledStudents.push(student);
        if (expelledStudents.length > 0) {
          showExpelled.classList.remove("show-expel-hidden");
        }

        studentCard.classList.add("fade-out");
        modal.remove();

        setTimeout(() => {
          showData(students);
        }, 500);
      }

      showExpelled.addEventListener("click", () => {
        showData(expelledStudents, true);
      });

      if (student.status) {
        modalStatus.textContent = "Status: expelled";
        modalExpelBtn.remove();
      } else {
        modalStatus.textContent = "Status: active";
        modalExpelBtn.textContent = "Expel";
      }

      document.querySelector("#student-container").appendChild(popClone);
    });

    document.querySelector("#student-container").appendChild(studentClone);
  });
  displayedStudentsCounter.textContent = `Displayed students: ${students.length}`;
}

function checkNames(first, middle, last, nick) {
  let fullName;
  let middleName;
  let lastName;
  let nickName;

  if (!middle) {
    if (!last || last === "zzz") {
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
  let parent = document.querySelector("#student-container");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

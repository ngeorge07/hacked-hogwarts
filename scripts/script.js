"use strict";
import fetchData from "./clean-script.js";

fetch("https://petlatkea.dk/2021/hogwarts/students.json")
  .then((response) => response.json())
  .then(passFunction);

function passFunction(students) {
  const allData = fetchData(students);

  allData.forEach((student) => {
    console.log(student);
    const studentTemp = document.querySelector("#student-template").content;
    const studentClone = studentTemp.cloneNode("true");
    const btn = studentClone.querySelector(".new-row");

    const firstName = studentClone.querySelector(".first-name");
    const middleName = studentClone.querySelector(".middle-name");
    const lastName = studentClone.querySelector(".last-name");
    const house = studentClone.querySelector(".house");

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

      if (student.image) {
        modalImg.src = student.image;
      }

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

"use strict";
import fetchData from "./clean-script.js";

fetch("https://petlatkea.dk/2021/hogwarts/students.json")
  .then((response) => response.json())
  .then(passFunction);

function passFunction(students) {
  const allData = fetchData(students);

  allData.forEach((student) => {
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

      modal.style.display = "block";

      span.onclick = function () {
        modal.remove();
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.remove();
        }
      };
      popClone.querySelector("h2").innerText = student.fullname;
      popClone.querySelector("#movie").innerText = student.middle_name;

      document.querySelector("tbody").appendChild(popClone);
    });

    document.querySelector("tbody").appendChild(studentClone);
  });
}

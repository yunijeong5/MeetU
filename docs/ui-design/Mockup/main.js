function init() {
  const earliestPicker = document.getElementById("earliest");
  const latestPicker = document.getElementById("latest");

  const timeStrings = [];
  for (let i = 0; i < 24; i++) {
    let timeString = i == 12 ? "12:00" : `${Number(i) % 12}:00`;
    if (i < 12) {
      timeString += " AM";
    } else {
      timeString += " PM";
    }
    timeStrings.push(timeString);
  }

  timeStrings.map((time, i) => {
    let opt1 = document.createElement("option");
    opt1.value = i; // the index
    opt1.innerHTML = time;
    earliestPicker.append(opt1);

    let opt2 = document.createElement("option");
    opt2.value = i; // the index
    opt2.innerHTML = time;
    latestPicker.append(opt2);
  });

  // resize date picker calendar view
  const calendar = document.getElementsByClassName("tempus-dominus-widget")[0];
  calendar.style.width = "100%";
  calendar.style.borderRadius = "10px";
  // calendar.style.boxShadow = "none";

  const clearButton = calendar.children[0].children[0];
  clearButton.innerText = "🗑️ Clear All Selections";
}

init();

const htmlDiv = document.querySelector("html");
const themeDiv = document.getElementById("theme-div");
const themeButton = document.getElementById("theme-icon");
const calendar = document.getElementsByClassName("tempus-dominus-widget")[0];
const calendarCollection = document.getElementsByClassName(
  "tempus-dominus-widget"
);

function switchTheme() {
  const theme = htmlDiv.getAttribute("data-bs-theme");
  if (theme == "light") {
    htmlDiv.setAttribute("data-bs-theme", "dark");
    themeButton.src = "./moon-svgrepo-com.svg";
    calendar.classList.remove("light");
    calendar.classList.add("dark");
  } else {
    htmlDiv.setAttribute("data-bs-theme", "light");
    themeButton.src = "./sun-svgrepo-com.svg";
    calendar.classList.remove("dark");
    calendar.classList.add("light");
  }
  calendar.style.accentColor = "red";
  const clearText = document.createElement("span");
  clearText.textContent = "Clear All";
}

themeButton.addEventListener("click", switchTheme);

// document.getElementsByClassName("active").forEach((element) => {
//   console.log(element);
//   element.style.backgroundColor = "red";
// });

// console.log(calendar.style);

// console.log(document.getElementsByClassName("active"));

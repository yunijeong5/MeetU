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
    const calendar = document.getElementsByClassName(
        "tempus-dominus-widget"
    )[0];
    calendar.style.width = "100%";
    calendar.style.borderRadius = "10px";
    calendar.style.boxShadow = "none";

    const clearButton = calendar.children[0].children[0];
    clearButton.innerText = "🗑️ Clear All Selections";
}

init();

// Switch theme button functionality

const htmlDiv = document.querySelector("html");
const themeButton = document.getElementsByClassName("theme-icon")[0];
const calendar = document.getElementsByClassName("tempus-dominus-widget")[0];
const pollBox = document.getElementById("poll-box");
const datePickerBox = document.getElementById("date-picker");
const dayPickerBox = document.getElementById("day-picker");
const navBar = document.getElementsByClassName("navbar")[0];
const footer = document.getElementById("footer");

function switchTheme() {
    const theme = htmlDiv.getAttribute("data-bs-theme");
    if (theme == "light") {
        htmlDiv.setAttribute("data-bs-theme", "dark");
        themeButton.src = "./moon-svgrepo-com.svg";
        calendar.classList.remove("light");
        calendar.classList.add("dark");
        pollBox.style.backgroundColor = "#343a40";
        datePickerBox.style.backgroundColor = "#343a40";
        dayPickerBox.style.backgroundColor = "#343a40";
        navBar.style.borderBottom = "1px solid #343a40";
        footer.style.borderTop = "1px solid #343a40";
    } else {
        htmlDiv.setAttribute("data-bs-theme", "light");
        themeButton.src = "./sun-svgrepo-com.svg";
        calendar.classList.remove("dark");
        calendar.classList.add("light");
        pollBox.style.backgroundColor = "#e9ecef";
        datePickerBox.style.backgroundColor = "#e9ecef";
        dayPickerBox.style.backgroundColor = "#e9ecef";
        navBar.style.borderBottom = "1px solid #e9ecef";
        footer.style.borderTop = "1px solid #e9ecef";
    }
}

themeButton.addEventListener("click", switchTheme);

// RemoveAdd poll option functionality
// TODO: Save poll options in the local storage?  or in the DB
let numOptions = 0;
const addPollButton = document.getElementById("add-poll-btn");
const pollList = document.getElementById("poll-options");

function removePollOption(num) {
    document.getElementById(`input-${num}`).remove();
    numOptions -= 1;
    if (numOptions === 0) {
        pollList.classList.add("d-none");
    }
}

function addPollOption(num) {
    pollList.classList.remove("d-none");
    const liElem = document.createElement("li");
    const divInputElem = document.createElement("div");
    const inputElem = document.createElement("input");
    const divRemoveElem = document.createElement("div");
    const spanElem = document.createElement("span");

    spanElem.textContent = "🗑️";
    spanElem.classList.add("input-group-text");
    spanElem.classList.add("cursor-pointer");

    divRemoveElem.classList.add("input-group-append");
    divRemoveElem.id = `remove-${num}`;
    divRemoveElem.appendChild(spanElem);
    divRemoveElem.addEventListener("click", () => removePollOption(num));
    divRemoveElem.setAttribute("title", "Delete poll item");

    inputElem.setAttribute("type", "text");
    inputElem.setAttribute("placeholder", "Enter poll option");
    inputElem.setAttribute("aria-label", "Poll option");
    inputElem.classList.add("form-control");

    divInputElem.classList.add("input-group");
    divInputElem.appendChild(inputElem);
    divInputElem.appendChild(divRemoveElem);

    liElem.id = `input-${num}`;
    liElem.classList.add("mb-2");
    liElem.appendChild(divInputElem);
    pollList.appendChild(liElem);

    numOptions += 1;
}

addPollButton.addEventListener("click", () => addPollOption(numOptions));

// color swith when clicking on day of week button

const dayButtons = document.getElementsByClassName("day-btn");

function switchBackgroundColor() {
    this.classList.toggle("bg-blue");
}

for (let i = 0; i < dayButtons.length; i++) {
    dayButtons[i].addEventListener("click", switchBackgroundColor);
}

// Meeting days selection mode switch
const meetingDaysSelector = document.getElementById("days-mode");

meetingDaysSelector.onchange = () => {
    datePickerBox.classList.toggle("hide");
    dayPickerBox.classList.toggle("hide");
};
{
    /* <li id="input-0" class="mb-2">
  <div class="input-group">
    <input
      type="text"
      class="form-control"
      placeholder="Enter poll option"
      aria-label="Poll option"
    />
    <div class="input-group-append" id="remove-0">
      <span class="input-group-text">🗑️</span>
    </div>
  </div>
</li>; */
}

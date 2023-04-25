import { picker } from "./calendar.js";

// comment this out if you want to see the time menu
import { createEvent } from "../Backend/pouchCrud.js";

function init() {
    // populate time options
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

    timeStrings.map((time) => {
        let opt1 = document.createElement("option");
        opt1.value = time; // the index
        opt1.innerHTML = time;
        earliestPicker.append(opt1);

        let opt2 = document.createElement("option");
        opt2.value = time; // the index
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

async function allEvents() {
    const json = await crud.readAllCounters();
    all.innerHTML = JSON.stringify(json);
}

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
    inputElem.id = `poll-option-${num}`;

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
    this.classList.toggle("chosen-day");
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

// Submission validation
function formValidation() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.querySelectorAll(".needs-validation");
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener(
            "submit",
            function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add("was-validated");
            },
            false
        );
    });
}

formValidation();

// collect all data when create new event button is clicked, and crate JSON object
const meetingTitle = document.getElementById("meeting-title");
const meetingDescription = document.getElementById("meeting-desc");
const daySelection = document.getElementById("days-mode");
const earliestTime = document.getElementById("earliest");
const latestTime = document.getElementById("latest");
const pollTitle = document.getElementById("poll-title");

const submitButton = document.getElementById("create-event-btn");
const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

async function createNewEvent() {
    const event = {};
    // Get title and description
    event["title"] = meetingTitle.value;
    event["description"] = meetingDescription.value;
    // Get dates or days selected, depending on current mode
    if (daySelection.value === "Specific days") {
        const dates = [...picker.dates.picked].map((date) => [
            monthNames[date.month],
            date.date,
            date.year,
        ]);
        event["dates"] = dates;
    } else {
        const selectedDays = document.getElementsByClassName("chosen-day");
        const days = [...selectedDays].map((day) => day.innerText);
        event["days"] = days;
    }
    // Get earliest and latest times
    event["time"] = [earliestTime.value, latestTime.value];
    // Get poll title and options, if any
    const pollOptions = document.querySelectorAll('[id^="poll-option-"]');
    const options = [...pollOptions].map((option) => option.value);
    const pollInfo = {};
    pollInfo["title"] = pollTitle.value;
    pollInfo["options"] = options;
    event["poll"] = pollInfo;


    // convert to JSON object
    const response = await createEvent(event);
    console.log(response);
}   

submitButton.addEventListener("submit", createNewEvent);

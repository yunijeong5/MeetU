import {
    calculateDiffBtwnTwoDates,
    getWeekDays,
    findDiffInDatesArray,
    getDateStrings,
} from "./weekdays.js";

import { loadMeetingJSON, loadUserMeetingJSON } from "./loadFromDB.js";

// convertTimeToNumber(timeString)
function convertTimeToNumber(timeString) {
    const indexOfIncrement = timeString.indexOf(":");
    const firstLetterOfIncrement = indexOfIncrement + 1;
    const secondLetterOfIncrement = indexOfIncrement + 3;

    const increment = Number(
        timeString.slice(firstLetterOfIncrement, secondLetterOfIncrement)
    );
    const beforeAfterMidDay = timeString.slice(-2).toUpperCase();

    let hour = Number(timeString.slice(0, indexOfIncrement));

    if (beforeAfterMidDay === "PM" && hour !== 12) {
        hour += 12;
    }

    let computedTime;

    if (increment === 0) {
        computedTime = hour;
    }

    if (increment === 30) {
        computedTime = hour + 0.5;
    }

    return computedTime;
}

// convertNumberToTime(timeAsNumber)
function convertNumberToTime(timeAsNumber) {
    if (timeAsNumber < 0 || timeAsNumber > 23.5) {
        console.log("Time must be valid");
        return null;
    }

    let timeAsString = "";
    let newString = "";

    if (timeAsNumber >= 12 && timeAsNumber < 13) {
        if (timeAsNumber % 1 === 0) {
            timeAsString = timeAsNumber.toString();
            newString = timeAsString.concat("", ":00 PM");
        } else {
            timeAsNumber -= 0.5;
            timeAsString = timeAsNumber.toString();
            newString = timeAsString.concat("", ":30 PM");
        }
    } else if (timeAsNumber >= 13) {
        timeAsNumber -= 12;
        if (timeAsNumber % 1 === 0) {
            timeAsString = timeAsNumber.toString();
            newString = timeAsString.concat("", ":00 PM");
        } else {
            timeAsNumber -= 0.5;
            timeAsString = timeAsNumber.toString();
            newString = timeAsString.concat("", ":30 PM");
        }
    } else {
        if (timeAsNumber % 1 === 0) {
            timeAsString = timeAsNumber.toString();
            newString = timeAsString.concat("", ":00 AM");
        } else {
            timeAsNumber -= 0.5;
            timeAsString = timeAsNumber.toString();
            newString = timeAsString.concat("", ":30 AM");
        }
    }

    return newString;
}

// generateArrayOfTimeIncrements
function generateArrayOfTimeIncrements(startTimeString, endTimeString, dates) {
    let diffInDays = findDiffInDatesArray(dates);
    let weekDays = getWeekDays(dates);

    let startTimeNumber = convertTimeToNumber(startTimeString);
    let endTimeNumber = convertTimeToNumber(endTimeString);

    let arrOfTimeIncrements = [];

    let currTimeNumber;

    let currTimeAsString = "";

    // Test Case #1
    let daysAndTimes = {};

    if (startTimeNumber < endTimeNumber) {
        currTimeNumber = startTimeNumber;

        while (currTimeNumber <= endTimeNumber) {
            currTimeAsString = convertNumberToTime(currTimeNumber);
            arrOfTimeIncrements.push(currTimeAsString);
            currTimeNumber += 0.5;
        }

        for (let i = 0; i < weekDays.length; ++i) {
            daysAndTimes[weekDays[i]] = [...arrOfTimeIncrements];
        }
    }

    // Test Case #2
    if (startTimeNumber >= endTimeNumber) {
        let beginning = startNumber;
    }

    return daysAndTimes;
}

// Populate Title and Description Fields with information provided by user from the Create Event user interface.
// document.getElementById("meeting-title").innerHTML = JSON.parse(localStorage.getItem("serializedRes"))["title"];
// document.getElementById("meeting-desc").innerHTML = '"' + JSON.parse(localStorage.getItem("serializedRes"))["description"] + '"';

let userTable = document.getElementById("user-table");
let groupTable = document.getElementById("group-table");

let startingTime = "8:00 PM";
let endingTime = "11:00 PM";

let dates = [
    ["May", 11, 2023],
    ["May", 12, 2023],
    ["May", 13, 2023],
    ["May", 14, 2023],
    ["May", 15, 2023],
    ["May", 16, 2023],
    ["May", 17, 2023],
];

// Steps to generate the table
// Get the body of the table
// function generateTimeTable(table, startTime, endTime, dates) { // James - commented out startTime, endTime, and dates to for stubbing
function renderTable(userTable) {
    const daysWithTimes = generateArrayOfTimeIncrements(
        startingTime,
        endingTime,
        dates
    );
    let selectedDays = Object.keys(daysWithTimes);
    let selectedTimes = Object.values(daysWithTimes); // is an array of arrays of timeframes [ [ 6:00, 6:30, 7:00 ], []]
    let timeTableHead = userTable.createTHead();
    let headRow = timeTableHead.insertRow();

    let timeTableBody = userTable.createTBody();

    // Get the start time provided by the user from the Create Event user interface
    // const startTime = JSON.parse(localStorage.getItem("serializedRes"))["time"][0];
    // const endTime = JSON.parse(localStorage.getItem("serializedRes"))["time"][1];
    // const dates = JSON.parse(localStorage.getItem("serializedRes"))["dates"];

    const dateStrings = getDateStrings(dates);

    for (let i = 0; i < selectedDays.length; ++i) {
        if (i === 0) {
            let thHead = document.createElement("th");

            headRow.append(thHead);
            thHead.setAttribute("scope", "col");
        }

        let th = document.createElement("th");
        headRow.append(th);
        th.classList.add("table-header");
        th.classList.add("text-center");
        th.setAttribute("scope", "col");
        th.textContent = selectedDays[i].slice(0, 3).toUpperCase();

        const dateString = document.createElement("div");
        dateString.textContent = dateStrings[i].slice(0, -5);
        th.appendChild(dateString);
    }

    const startTimeAsNumber = convertTimeToNumber(startingTime);
    const endTimeAsNumber = convertTimeToNumber(endingTime);

    let differenceBetweenStartAndEndTimes = 0;

    // Case #1
    if (endTimeAsNumber > startTimeAsNumber) {
        differenceBetweenStartAndEndTimes = Math.abs(
            endTimeAsNumber - startTimeAsNumber
        );
    }

    // Beginning of Case #2
    if (endTimeAsNumber <= startTimeAsNumber) {
        differenceBetweenStartAndEndTimes =
            Math.abs(24 - startTimeAsNumber) + Math.abs(endTimeAsNumber);
    }

    let numRows = differenceBetweenStartAndEndTimes * 4;
    let count = 0;
    const tableType = userTable.id.slice(0, 1);

    for (let i = 0; i < numRows + 1; ++i) {
        let newRow = timeTableBody.insertRow();

        for (let j = 0; j < selectedDays.length; ++j) {
            let newCell = newRow.insertCell(j);
            newCell.id = `${tableType}.${i}x${j}`;
            newCell.classList.add("td");

            if (tableType === "u") {
                newCell.addEventListener("mousedown", async function () {
                    this.classList.toggle("highlight");
                    // TODO: send updated data to backend
                    // send {selectedTimes: ['1x10',....], selectedOptions: ['o1'....], user: username, mid: meetingID}
                    const res = await fetch("/sendUserMeeting", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            user: username,
                            mid: meetingID,
                            selectedTimes: selectedTimes, // TODO:
                            selectedOptions: selectedOptions, // TODO:
                        }),
                    });

                    // TODO: rerender groups table
                    // fetch all users' input for this meeting.
                });
            }
        }

        // let th = document.createElement("th");
        let th = document.createElement("div");
        newRow.prepend(th);
        th.classList.add("table-time", "p-0", "m-0");
        th.setAttribute("scope", "row");
        th.classList.add(`row-${i}`);

        if (i % 2 === 0) {
            th.innerHTML = selectedTimes[0][count]; // change
            ++count;
        }
    }
}

renderTable(userTable);
renderTable(groupTable);

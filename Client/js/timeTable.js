import {
    calculateDiffBtwnTwoDates,
    getWeekDays,
    findDiffInDatesArray,
    getDateStrings,
    getNextDay,
    convertMonthIntToName,
    convertNameOfMonthToInt,
    convertNumToWeekDay,
} from "./weekdays.js";

import { loadMeetingJSON, loadUserMeetingJSON } from "./loadFromDB.js";

import { findMyData, generateColorScale, renderSummary } from "./selectTime.js";

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

function generateStLessThanET(stn, etn, times, dAndT, wd) {
    // times is an array of strings
    let ctn = stn;
    let ctString = "";
    console.log("the etn is: " + etn);

    while (ctn <= etn) {
        ctString = convertNumberToTime(ctn);
        times.push(ctString);
        ctn += 0.5;
    }

    for (let i = 0; i < wd.length; ++i) {
        dAndT[wd[i]] = [...times];
    }

    console.log(dAndT);
    return dAndT;
}

function generateEtIsMidnight(stn, etn, times, dAndT, wd) {
    // times is an array of strings
    let ctn = stn;
    let ctString = "";
    console.log("the etn is: " + etn);

    let lastTime = etn + 23.5;

    while (ctn <= lastTime) {
        ctString = convertNumberToTime(ctn);
        times.push(ctString);
        ctn += 0.5;
    }

    for (let i = 0; i < wd.length; ++i) {
        dAndT[wd[i]] = [...times];
    }

    console.log(dAndT);
    return dAndT;
}

// generateArrayOfTimeIncrements
// generateArrayOfTimeIncrements
function generateArrayOfTimeIncrements(startTimeString, endTimeString, dates) {
    let differenceInNumberOfDays = findDiffInDatesArray(dates);
    console.log("Here's the difference " + differenceInNumberOfDays);
    let weekDays = getWeekDays(dates);

    let startTimeNumber = convertTimeToNumber(startTimeString);
    let endTimeNumber = convertTimeToNumber(endTimeString);

    //   let arrOfTimeIncrements = [];
    //   let currTimeNumber;
    //   let currTimeAsString = "";
    let differenceInDaysTracker = 0;

    // Test Case #1
    let daysAndTimes = {};

    if (endTimeNumber === 0) {
        daysAndTimes = generateEtIsMidnight(
            startTimeNumber,
            endTimeNumber,
            [],
            daysAndTimes,
            weekDays
        );
        console.log(daysAndTimes);
    } else if (startTimeNumber < endTimeNumber) {
        // currTimeNumber = startTimeNumber;

        // while (currTimeNumber <= endTimeNumber) {
        //   currTimeAsString = convertNumberToTime(currTimeNumber);
        //   arrOfTimeIncrements.push(currTimeAsString);
        //   currTimeNumber += 0.5;
        // }

        // for (let i = 0; i < weekDays.length; ++i) {
        //   daysAndTimes[weekDays[i]] = [...arrOfTimeIncrements];
        // }
        daysAndTimes = generateStLessThanET(
            startTimeNumber,
            endTimeNumber,
            [],
            daysAndTimes,
            weekDays
        );
    } else {
        return daysAndTimes; // changing later - just here for now
    }

    return daysAndTimes;
}

// Populate Title and Description Fields with information provided by user from the Create Event user interface.
// document.getElementById("meeting-title").innerHTML = JSON.parse(localStorage.getItem("serializedRes"))["title"];
// document.getElementById("meeting-desc").innerHTML = '"' + JSON.parse(localStorage.getItem("serializedRes"))["description"] + '"';

let userTable = document.getElementById("user-table");
let groupTable = document.getElementById("group-table");

// meeting basic/common info
const res = await loadMeetingJSON();
const meeting = res["value"];
const username = res["username"];
const dates = meeting["dates"];
const startingTime = meeting["time"][0];
const endingTime = meeting["time"][1];

// let startingTime = "0:00 AM";
// let endingTime = "0:00 AM";

// let dates = [
//     ["May", 11, 2023],
//     //   ["May", 12, 2023],
//     // ["May", 13, 2023],
//     //   ["May", 14, 2023],
//     //   ["May", 15, 2023],
//     //   ["May", 16, 2023],
//     // ["May", 17, 2023],
// ];

// let dates2 = [
//     ["May", 11, 2023],
//     ["May", 12, 2023],
//     ["May", 13, 2023],
//     ["May", 14, 2023],
//     ["May", 15, 2023],
//     ["May", 16, 2023],
//     ["May", 17, 2023],
// ];

// Steps to generate the table
// Get the body of the table
// function generateTimeTable(table, startTime, endTime, dates) { // James - commented out startTime, endTime, and dates to for stubbing
async function renderTable(userTable) {
    // reset tables
    userTable.innerHTML = "";
    groupTable.innerHTML = "";

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

    let startTimeAsNumber = convertTimeToNumber(startingTime);
    let endTimeAsNumber = convertTimeToNumber(endingTime);

    let differenceBetweenStartAndEndTimes = 0;
    let numRows;

    // Case #1
    if (endTimeAsNumber > startTimeAsNumber) {
        differenceBetweenStartAndEndTimes = Math.abs(
            endTimeAsNumber - startTimeAsNumber
        );
        numRows = differenceBetweenStartAndEndTimes * 4;
    } else if (endTimeAsNumber === 0 && startTimeAsNumber > endTimeAsNumber) {
        endTimeAsNumber = 23.5;
        differenceBetweenStartAndEndTimes = Math.abs(
            endTimeAsNumber - startTimeAsNumber
        );
        numRows = differenceBetweenStartAndEndTimes * 4 + 1;
    } else if (endTimeAsNumber === 0 && startTimeAsNumber === 0) {
        endTimeAsNumber = 23.5;
        differenceBetweenStartAndEndTimes = Math.abs(
            endTimeAsNumber - startTimeAsNumber
        );
        numRows = differenceBetweenStartAndEndTimes * 4 + 1;
    } else {
        differenceBetweenStartAndEndTimes = endTimeAsNumber - startTimeAsNumber; // changing just leaving here for now.
    }

    // Beginning of Case #2
    //   if (endTimeAsNumber <= startTimeAsNumber) {
    //     differenceBetweenStartAndEndTimes =
    //       Math.abs(24 - startTimeAsNumber) + Math.abs(endTimeAsNumber);
    //   }

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

    let count = 0;
    let day = 0;

    const tableType = userTable.id.slice(0, 1);

    for (let i = 0; i < numRows + 1; ++i) {
        let newRow = timeTableBody.insertRow();

        for (let j = 0; j < selectedDays.length; ++j) {
            let newCell = newRow.insertCell(j);
            newCell.id = `${tableType}.${i}x${j}`;
            newCell.classList.add("td");

            // only usertable is clickable
            if (tableType === "u") {
                newCell.addEventListener("mousedown", async function () {
                    const allUsers = await loadUserMeetingJSON();
                    let myVotes = [];
                    let myTimes = [];
                    // console.log("allusers", allUsers);
                    if (allUsers[0] !== null) {
                        const myData = findMyData(username, allUsers);
                        myVotes = myData.selectedOptions;
                        myTimes = myData.selectedTimes;
                        // console.log(myTimes);
                    }

                    // if this.id is already selected, this click removes selection
                    if (myTimes.includes(this.id)) {
                        // remove current selection
                        const index = myTimes.indexOf(this.id);
                        if (index > -1) {
                            myTimes.splice(index, 1);
                        }
                        this.classList.remove("highlight");
                        // await colorTables();
                    }
                    // else, add cur time from myTimes
                    else {
                        myTimes.push(this.id);
                    }

                    const res = await fetch("/sendUserMeeting", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            selectedTimes: myTimes,
                            selectedOptions: myVotes,
                        }),
                    });
                    await colorTables();
                    // location.reload(); // solves the issue but visual gets glitchy... not the best
                }); // end of addEventListener for userTable
            }
        }

        // let th = document.createElement("th");
        let th = document.createElement("div");
        newRow.prepend(th);
        th.classList.add("table-time", "p-0", "m-0");
        th.setAttribute("scope", "row");
        th.classList.add(`row-${i}`);

        if (i % 2 === 0) {
            th.innerHTML = selectedTimes[day][count]; // change put more times on the side?
            ++count;
        }

        // if (count === selectedTimes[day].length) {
        //   ++day;
        //   count = 1;
        // }
    }
}

await renderTable(userTable);
await renderTable(groupTable);

async function colorTables() {
    const allUsers = await loadUserMeetingJSON();
    // nothing to color.
    if (allUsers[0] === null) {
        return;
    }

    const myData = findMyData(username, allUsers);
    const myTimes = myData.selectedTimes;

    // color userTable according to myTimes
    // console.log("My Times: ", myTimes);
    for (const id of myTimes) {
        const timeCell = document.getElementById(id);
        timeCell.classList.add("highlight");
    }

    // color groupTablae according to allTimes
    // TODO: add names as title to each groupTable cell.
    // get total number of people who selected time and generate color scale
    const numLevels = Math.max(
        2,
        allUsers.filter((o) => o.selectedTimes.length > 0).length + 1
    );
    const colorScale = generateColorScale(numLevels, "0d6efd");

    // make {time: [usernames]} object
    const timeUsers = {};
    for (const o of allUsers) {
        o.selectedTimes.forEach((id) => {
            const cellNum = "g" + id.slice(1);
            if (cellNum in timeUsers) {
                timeUsers[cellNum].push(o.username);
            } else {
                timeUsers[cellNum] = [o.username];
            }
        });
    }

    // color cells based on number of users who selected that time
    for (const [cellNum, usernameArr] of Object.entries(timeUsers)) {
        const matchingGroupCell = document.getElementById(cellNum);
        matchingGroupCell.style.background = colorScale[usernameArr.length];
        matchingGroupCell.setAttribute("title", `Selected by ${usernameArr}`);
    }

    // to update participants list
    await renderSummary();
}

await colorTables();

// TODO: Error--Removal of times are not immediately applied to group table view.

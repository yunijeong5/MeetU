import {
    calculateDiffBtwnTwoDates,
    getWeekDays,
    findDiffInDatesArray,
    getDateStrings,
    getNextDay,
    convertMonthIntToName,
    convertNameOfMonthToInt
} from "./weekdays.js";

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
// generateArrayOfTimeIncrements
function generateArrayOfTimeIncrements(startTimeString, endTimeString, dates) {
    let differenceInNumberOfDays = findDiffInDatesArray(dates);
    let weekDays = getWeekDays(dates);

    let startTimeNumber = convertTimeToNumber(startTimeString);
    let endTimeNumber = convertTimeToNumber(endTimeString);

    let arrOfTimeIncrements = [];

    let currTimeNumber;

    let currTimeAsString = "";

    let differenceInDaysTracker = 0;

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
        let currTimeNumber = startTimeNumber;
        let midnight = 24;
        let currDay = 0;
        let nextWeekDay = "";

        while (currTimeNumber <= midnight) {
            if (currTimeNumber === midnight) {
                currTimeNumber = 0;
                
                currTimeAsString = convertNumberToTime(currTimeNumber);
                arrOfTimeIncrements.push(currTimeAsString);
                
                break;
            }

            currTimeAsString = convertNumberToTime(currTimeNumber);
            arrOfTimeIncrements.push(currTimeAsString);
            currTimeNumber += 0.5;
        }

        daysAndTimes[weekDays[currDay]] = [...arrOfTimeIncrements];
        arrOfTimeIncrements = [];

        if (differenceInNumberOfDays[differenceInDaysTracker] > 1 
            || differenceInNumberOfDays[differenceInDaysTracker] === 0 
            || differenceInNumberOfDays.length < 1) {
            // get next day
            nextWeekDay = getNextDay(weekDays[currDay]);

            let storedDateMonth = dates[0][0];
            let storedDateMonthAsInt = convertNameOfMonthToInt(storedDateMonth);
            let storedDateDay = dates[0][1];
            let storedDateYear = dates[0][2];

            let constructedDate = new Date(storedDateYear, storedDateMonthAsInt, storedDateDay);
            let newConstructedDate = new Date(constructedDate.setDate(constructedDate.getDate() + 1));
            console.log(newConstructedDate);

            let nextDateMonth = newConstructedDate.getUTCMonth();
            let nextDateMonthAsString = convertMonthIntToName(nextDateMonth);
            
            let nextDateDay = newConstructedDate.getUTCDate();
            let nextDateYear = newConstructedDate.getUTCFullYear();

            let storedNextDate = [nextDateMonthAsString, nextDateDay, nextDateYear];
            
            dates.push(storedNextDate);
        }

        // ++currDay;

        while (currTimeNumber <= endTimeNumber) {
            currTimeAsString = convertNumberToTime(currTimeNumber);
            arrOfTimeIncrements.push(currTimeAsString);
            currTimeNumber += 0.5;
        }
        
        daysAndTimes[nextWeekDay] = [...arrOfTimeIncrements];
    }

    return daysAndTimes;
}

// Populate Title and Description Fields with information provided by user from the Create Event user interface.
// document.getElementById("meeting-title").innerHTML = JSON.parse(localStorage.getItem("serializedRes"))["title"];
// document.getElementById("meeting-desc").innerHTML = '"' + JSON.parse(localStorage.getItem("serializedRes"))["description"] + '"';

let userTable = document.getElementById("user-table");
let groupTable = document.getElementById("group-table");
let startingTime = "10:00 PM";
let endingTime = "2:00 AM";

let dates = [
    ["May", 11, 2023],
    // ["May", 12, 2023],
    // ["May", 13, 2023],
    // ["May", 14, 2023],
    // ["May", 15, 2023],
    // ["May", 16, 2023],
    // ["May", 17, 2023],
];

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

        if (count === selectedTimes[day].length) {
            ++day;
            count = 1;
        }
    }
}

renderTable(userTable);
renderTable(groupTable);

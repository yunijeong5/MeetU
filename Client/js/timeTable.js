import { calculateDiffBtwnTwoDates, getWeekDays, findDiffInDatesArray, getDateStrings } from './weekdays.js';

// convertTimeToNumber(timeString)
function convertTimeToNumber(timeString) {
    const indexOfIncrement = timeString.indexOf(":");
    const firstLetterOfIncrement = indexOfIncrement + 1;
    const secondLetterOfIncrement = indexOfIncrement + 3;

    const increment = Number(timeString.slice(firstLetterOfIncrement, secondLetterOfIncrement));
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
let startingTime = "8:00 PM";
let endingTime = "11:00 PM";

let dates = [ ["May", 8, 2023], ["May", 10, 2023], ["May", 11, 2023] ];


// Steps to generate the table
// Get the body of the table
// function generateTimeTable(table, startTime, endTime, dates) { // James - commented out startTime, endTime, and dates to for stubbing

const daysWithTimes = generateArrayOfTimeIncrements(startingTime, endingTime, dates);
console.log("dayswithtime", daysWithTimes)
let selectedDays = Object.keys(daysWithTimes);
let selectedTimes = Object.values(daysWithTimes); // is an array of arrays of timeframes [ [ 6:00, 6:30, 7:00 ], []]
console.log("HERE", selectedTimes);
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
        th.setAttribute("scope", "col");
        th.textContent = selectedDays[i];
        
        const dateString = document.createElement('div');
        dateString.textContent = dateStrings[i];
        th.appendChild(dateString)
    }

    const startTimeAsNumber = convertTimeToNumber(startingTime);
    const endTimeAsNumber = convertTimeToNumber(endingTime);

    let differenceBetweenStartAndEndTimes = 0;

    // Case #1
    if (endTimeAsNumber > startTimeAsNumber) {
        differenceBetweenStartAndEndTimes = Math.abs(endTimeAsNumber - startTimeAsNumber);
    }

    // Beginning of Case #2
    if (endTimeAsNumber <= startTimeAsNumber) {
        differenceBetweenStartAndEndTimes = Math.abs(24 - startTimeAsNumber) + Math.abs(endTimeAsNumber);
    }

    
    let numRows = differenceBetweenStartAndEndTimes * 4;
    let count = 0;

    for (let i = 0; i < numRows+1; ++i) {
        let newRow = timeTableBody.insertRow();

        for (let j = 0; j < selectedDays.length; ++j) {
            let newCell = newRow.insertCell(j);
            newCell.classList.add("td");
        }

        // let th = document.createElement("th");
        let th = document.createElement("span");
        newRow.prepend(th);
        th.setAttribute("scope", "row");
        th.classList.add(`row-${i}`);

        if (i % 2 === 0) {
            th.innerHTML = selectedTimes[0][count]; // change
            ++count;
        }
    }

    // return;
// }

// generateTimeTable(userTable, startingTime, endingTime);    



    // for (let i = 0; i < numOfHeaders; ++i) {
    //     let thead = document.createElement("th");
    //     let th = document.createElement("th");
    //     newRow.append(th);
    //     th.setAttribute("scope", "col");
    //     th.classList.add(`col-${i}`);
    //     th.innerHTML = ` ${weekdays[i]} `;
    // }

    // const numOfRows = differenceBetweenStartAndEndTimes * 4;

    // let count = 0;

    // for (let i = 0; i < numOfRows; ++i) {
    //     let newRow = timeTableBody.insertRow(i);
    
        // For each row, cells are inserted which represent the dates and times 
        // chosen by the user in the Create Event user interface
        // for (let j = 0; j < weekDays.length; ++j) {
        //     let newCell = newRow.insertCell(j);
        //     newCell.classList.add("td");
        //     // newCell.setAttribute("id", ``)
        // }
        
        // let th = document.createElement("th");
        // newRow.prepend(th);
        // th.setAttribute("scope", "row");
        // th.classList.add(`row-${i}`);
    
        // populate table with times
        // if (i % 2 === 0) {
        //     th.innerHTML = times[count];
        //     count += 1;
        // }
//     }
// }

// Generating an array of half-hour time increments from the start time to the end time, both provided
// by the user from the Create Event user interface
// Example: generateArrayOfTimeIncrements("10:00AM", "2:00PM")
// -> ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM"];

// Converting the start and end times provided by the user in the Create Event user interface to
// decimal numbers to be used
/** Examples: 
 *     a) convertTimeToNumber("12:00 PM") -> 12
 *     b) convertTimeToNumber("10:30 AM") -> 10.5
 *     c) convertTimeToNumber("2:00 PM") -> 14
 * */
// const startTimeAsNumber = convertTimeToNumber(startTime);
// const endTimeAsNumber = convertTimeToNumber(endTime);

// Getting the difference between the start and end times to generate the number of rows
// Each hour should have four rows to account for 15 minute increments.
// let differenceBetweenStartAndEndTimes = 0;

// if (endTimeAsNumber > startTimeAsNumber) {
//     differenceBetweenStartAndEndTimes = Math.abs(endTimeAsNumber - startTimeAsNumber);
// }

// if (endTimeAsNumber <= startTimeAsNumber) {
//     differenceBetweenStartAndEndTimes = Math.abs(24 - startTimeAsNumber) + Math.abs(endTimeAsNumber);
// }

// const numOfHeaders = weekDays.length;

// for (let i = 0; i < numOfHeaders; ++i) {
//     let th = document.createElement("th");
//     newRow.append(th);
//     th.setAttribute("scope", "col");
//     th.classList.add(`col-${i}`);
//     th.innerHTML = ` ${weekdays[i]} `;
// }

// const numOfRows = differenceBetweenStartAndEndTimes * 4;

// defining a count variable to be used to write the innerHTML of each table row's table header
// with a half-hour time increment
// let count = 0;

// Outer for loop to generate the rows
// Example: If the chosen meeting period is from 2:00 PM to 4:00 PM,
// then there should be (2 hours) * [ (4 rows) / hour ] = 8 rows
// for (let i = 0; i < numOfRows; ++i) {
//     let newRow = timeTableBody.insertRow(i);

//     // For each row, cells are inserted which represent the dates and times 
//     // chosen by the user in the Create Event user interface
//     for (let j = 0; j < weekDays.length; ++j) {
//         let newCell = newRow.insertCell(j);
//         newCell.classList.add("td");
//         // newCell.setAttribute("id", ``)
//     }
    
//     let th = document.createElement("th");
//     newRow.prepend(th);
//     th.setAttribute("scope", "row");
//     th.classList.add(`row-${i}`);

//     // populate table with times
//     if (i % 2 === 0) {
//         th.innerHTML = times[count];
//         count += 1;
//     }
// }

// example of time array "time":["0:00 AM","5:00 AM"],
// function handleTableCases(startTime, endTime, chosenDates) {
//     let diffDays = findDiffInDatesArray(chosenDates);
//     let consecutive = diffDays.every(difference => difference < 2);
    
//     let weekDayNames = getWeekDays(chosenDates); 

//     // Case #1
//     if (endTime > startTime) {

//     }
// }
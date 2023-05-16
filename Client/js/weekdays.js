function convertDateToString(date) {
    // change?
    let month = date[0];
    let day = date[1];
    let year = date[2];

    let monthAsString = "0";

    switch (month) {
        case "January":
            monthAsString = "1";
            break;
        case "February":
            monthAsString = "2";
            break;
        case "March":
            monthAsString = "3";
            break;
        case "April":
            monthAsString = "4";
            break;
        case "May":
            monthAsString = "5";
            break;
        case "June":
            monthAsString = "6";
            break;
        case "July":
            monthAsString = "7";
            break;
        case "August":
            monthAsString = "8";
            break;
        case "September":
            monthAsString = "9";
            break;
        case "October":
            monthAsString = "10";
            break;
        case "November":
            monthAsString = "11";
            break;
        case "December":
            monthAsString = "12";
            break;
        default:
            console.log(`Sorry - ${month} is not a month!`);
    }

    let newDate = `${month}/${day}/${year}`;
    return newDate;
}

function convertMonthIntToName(monthAsInt) {
    let monthAsName = "";

    switch (monthAsInt) {
        case 1:
            monthAsName = "January";
            break;
        case 2:
            monthAsName = "February";
            break;
        case 3:
            monthAsName = "March";
            break;
        case 4:
            monthAsName = "April";
            break;
        case 5:
            monthAsName = "May";
            break;
        case 6:
            monthAsName = "June";
            break;
        case 7:
            monthAsName = "July";
            break;
        case 8:
            monthAsName = "August";
            break;
        case 9:
            monthAsName = "September";
            break;
        case 10:
            monthAsName = "October";
            break;
        case 11:
            monthAsName = "November";
            break;
        case 12:
            monthAsName = "December";
            break;
        default:
            console.log(`Sorry - ${monthAsInt} is not an integer from 1 to 12`);
    }

    return monthAsName;
}

function convertNameOfMonthToInt(nameOfMonth) {
    let monthInt = 0;

    switch (nameOfMonth) {
        case "January":
            monthInt = 1;
            break;
        case "February":
            monthInt = 2;
            break;
        case "March":
            monthInt = 3;
            break;
        case "April":
            monthInt = 4;
            break;
        case "May":
            monthInt = 5;
            break;
        case "June":
            monthInt = 6;
            break;
        case "July":
            monthInt = 7;
            break;
        case "August":
            monthInt = 8;
            break;
        case "September":
            monthInt = 9;
            break;
        case "October":
            monthInt = 10;
            break;
        case "November":
            monthInt = 11;
            break;
        case "December":
            monthInt = 12;
            break;
        default:
            console.log(`Sorry - ${monthAsInt} is not an integer from 1 to 12`);
    }

    return monthInt;
}

function getNextDay(date, diff) {
    let d;

    if (diff === 0 || diff === 1) {
        d = 1;
    } else {
        d = diff
    }

    let storedDateMonth = date[0];
    let storedDateMonthAsInt = convertNameOfMonthToInt(storedDateMonth);
    let storedDateDay = date[1];
    let storedDateYear = date[2];

    let constructedDate = new Date(storedDateYear, storedDateMonthAsInt, storedDateDay);
    let newConstructedDate = new Date(constructedDate.setDate(constructedDate.getDate() + d));
    // console.log(newConstructedDate);

    let nextDateMonth = newConstructedDate.getUTCMonth();
    let nextDateMonthAsString = convertMonthIntToName(nextDateMonth);

    let nextDateDay = newConstructedDate.getUTCDate();
    let nextDateYear = newConstructedDate.getUTCFullYear();

    let storedNextDate = [nextDateMonthAsString, nextDateDay, nextDateYear];

    return storedNextDate;

    // switch (dayAsString) {
    //     case "Monday":
    //         nextDayAsString = "Tuesday";
    //         break;
    //     case "Tuesday":
    //         nextDayAsString = "Wednesday";
    //         break;
    //     case "Wednesday":
    //         nextDayAsString = "Thursday";
    //         break;
    //     case "Thursday":
    //         nextDayAsString = "Friday";
    //         break;
    //     case "Friday":
    //         nextDayAsString = "Saturday";
    //         break;
    //     case "Saturday":
    //         nextDayAsString = "Sunday";
    //         break;
    //     case "Sunday":
    //         nextDayAsString = "Monday";
    //         break;
    //     default:
    //         console.log(`Sorry - ${dayAsString} is not a weekday`);
    // }

    // return nextDayAsString;
}

function calculateDiffBtwnTwoDates(date1, date2) {
    // let dayAsString = day.toString();
    // let yearAsString = year.toString();

    // let dateAsString = `${monthAsString}/${dayAsString}/${yearAsString}`;

    let date1AsString = convertDateToString(date1);
    let date2AsString = convertDateToString(date2);

    let d1 = new Date(date1AsString);
    let d2 = new Date(date2AsString);

    let timeDiff = Math.abs(d1 - d2);
    let dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return dayDiff;
}

function findDiffInDatesArray(dates) {
    // Generating the differences between each date.
    if (dates.length < 1) {
        return [];
    }

    if (dates.length < 2) {
        return [0];
    }

    let i = 0;
    let j = 1;

    let arrayOfDifferencesInDays = [];
    let difference = 0;

    while (j < dates.length) {
        difference = calculateDiffBtwnTwoDates(dates[j], dates[i]);
        arrayOfDifferencesInDays.push(difference);

        ++i;
        ++j;
    }

    return arrayOfDifferencesInDays;
}

function convertNumToWeekDay(num) {
    if (num < 0 || num > 7) {
        return "Not a weekday";
    }

    let dayName = "";

    switch (num) {
        case 0:
            dayName = "Sunday";
            break;
        case 1:
            dayName = "Monday";
            break;
        case 2:
            dayName = "Tuesday";
            break;
        case 3:
            dayName = "Wednesday";
            break;
        case 4:
            dayName = "Thursday";
            break;
        case 5:
            dayName = "Friday";
            break;
        case 6:
            dayName = "Saturday";
            break;
        default:
            console.log(`Sorry - ${num} is not between 0 and 6 inclusive!`);
    }

    return dayName;
}

function getDateStrings(chosenDates) {
    return chosenDates.map((date) => convertDateToString(date));
}

function getWeekDays(chosenDates) {
    let datesAsStrings = chosenDates.map((date) => convertDateToString(date));

    let dateObject = null;
    let convertedDates = [];

    // console.log(datesAsStrings);

    for (let i = 0; i < datesAsStrings.length; ++i) {
        dateObject = new Date(datesAsStrings[i]);
        convertedDates.push(dateObject);
    }

    // console.log(convertedDates);

    let weekDayNums = convertedDates.map((convertedDate) =>
        convertedDate.getDay()
    );
    // console.log("weekDay Numbers", weekDayNums);
    let weekDayNames = weekDayNums.map((weekDayNum) =>
        convertNumToWeekDay(weekDayNum)
    );
    // console.log(weekDayNames);
    return weekDayNames;
}

export {
    findDiffInDatesArray,
    getWeekDays,
    calculateDiffBtwnTwoDates,
    convertNumToWeekDay,
    getDateStrings,
    getNextDay,
    convertMonthIntToName,
    convertNameOfMonthToInt,
};

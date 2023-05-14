function convertDateToString(date) {
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
    return chosenDates.map(date => convertDateToString(date));
}

function getWeekDays(chosenDates) {

    let datesAsStrings = chosenDates.map(date => convertDateToString(date));

    let dateObject = null;
    let convertedDates = [];

    console.log(datesAsStrings);

    for (let i = 0; i < datesAsStrings.length; ++i) {
        dateObject = new Date(datesAsStrings[i]);
        convertedDates.push(dateObject);
    }

    console.log(convertedDates);

    let weekDayNums = convertedDates.map(convertedDate => convertedDate.getDay());
    console.log("weekDay Numbers", weekDayNums);
    let weekDayNames = weekDayNums.map(weekDayNum => convertNumToWeekDay(weekDayNum));
    console.log(weekDayNames)
    return weekDayNames;

}

export { findDiffInDatesArray, getWeekDays, calculateDiffBtwnTwoDates, convertNumToWeekDay, getDateStrings }
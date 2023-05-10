// Switch theme button functionality
const htmlDiv = document.querySelector("html");
const themeButton = document.getElementsByClassName("theme-icon")[0];
const calendar = document.getElementsByClassName("tempus-dominus-widget")[0];
const pollBox = document.getElementById("poll-box");
// const addPollButton = document.getElementById("add-poll-btn"); // declared in createEvent.js
const datePickerBox = document.getElementById("date-picker");
const dayPickerBox = document.getElementById("day-picker");
const navBar = document.getElementsByClassName("navbar")[0];
const footer = document.getElementById("footer");

function switchTheme() {
    console.log("theme button clicked");
    const theme = htmlDiv.getAttribute("data-bs-theme");
    if (theme == "light") {
        htmlDiv.setAttribute("data-bs-theme", "dark");
        themeButton.src = "../assets/misc/moon-svgrepo-com.svg";
        calendar.classList.remove("light");
        calendar.classList.add("dark");
        pollBox.style.backgroundColor = "#343a40";
        // addPollButton.style.backgroundColor = "#343a40";
        datePickerBox.style.backgroundColor = "#343a40";
        dayPickerBox.style.backgroundColor = "#343a40";
        navBar.style.borderBottom = "1px solid #343a40";
        footer.style.borderTop = "1px solid #343a40";
    } else {
        htmlDiv.setAttribute("data-bs-theme", "light");
        themeButton.src = "../assets/misc/sun-svgrepo-com.svg";
        calendar.classList.remove("dark");
        calendar.classList.add("light");
        pollBox.style.backgroundColor = "#e9ecef";
        // addPollButton.style.backgroundColor = "white";
        datePickerBox.style.backgroundColor = "#e9ecef";
        dayPickerBox.style.backgroundColor = "#e9ecef";
        navBar.style.borderBottom = "1px solid #e9ecef";
        footer.style.borderTop = "1px solid #e9ecef";
    }
}

themeButton.addEventListener("click", switchTheme);

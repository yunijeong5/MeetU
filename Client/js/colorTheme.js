// load saved theme
const storedTheme = localStorage.getItem("theme");
const icon = document.getElementById("theme-icon");

const getPreferredTheme = () => {
    if (storedTheme) {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

const setTheme = function (theme) {
    if (
        theme === "auto" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-bs-theme", theme);
    }

    getPreferredTheme() === "dark"
        ? (icon.src = "/assets/misc/moon-svgrepo-com.svg")
        : (icon.src = "/assets/misc/sun-svgrepo-com.svg");
};

setTheme(getPreferredTheme());

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
    const theme = htmlDiv.getAttribute("data-bs-theme");
    if (theme == "light") {
        htmlDiv.setAttribute("data-bs-theme", "dark");
        themeButton.src = "/assets/misc/moon-svgrepo-com.svg";
        if (calendar !== undefined) {
            calendar.classList.remove("light");
            calendar.classList.add("dark");
            pollBox.style.backgroundColor = "#343a40";
            datePickerBox.style.backgroundColor = "#343a40";
            dayPickerBox.style.backgroundColor = "#343a40";
        }
        navBar.style.borderBottom = "1px solid #343a40";
        footer.style.borderTop = "1px solid #343a40";
        localStorage.setItem("theme", "dark");
    } else {
        htmlDiv.setAttribute("data-bs-theme", "light");
        themeButton.src = "/assets/misc/sun-svgrepo-com.svg";
        if (calendar !== undefined) {
            calendar.classList.remove("dark");
            calendar.classList.add("light");
            pollBox.style.backgroundColor = "#e9ecef";
            datePickerBox.style.backgroundColor = "#e9ecef";
            dayPickerBox.style.backgroundColor = "#e9ecef";
        }
        navBar.style.borderBottom = "1px solid #e9ecef";
        footer.style.borderTop = "1px solid #e9ecef";
        localStorage.setItem("theme", "light");
    }
}

themeButton.addEventListener("click", switchTheme);

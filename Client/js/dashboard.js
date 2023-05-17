// Switch theme button functionality
// TODO: save theme between pages
import {
    loadMeetingJSON,
    loadUserMeetingJSON,
    loadAllMeetingsJSON,
} from "./loadFromDB.js";

const htmlDiv = document.querySelector("html");
const themeButton = document.getElementsByClassName("theme-icon")[0];
const navBar = document.getElementsByClassName("navbar")[0];
const footer = document.getElementById("footer");

function switchTheme() {
    const theme = htmlDiv.getAttribute("data-bs-theme");
    // TODO: Fix this weird bodge, I have no idea why this is happening
    // I tried debugging, and for only the dashboard, the attributes are coming in as opposites
    // So light theme => data-bs-theme = dark and vice versa
    if (theme == "dark") {
        htmlDiv.setAttribute("data-bs-theme", "dark");
        themeButton.src = "./moon-svgrepo-com.svg";
        navBar.style.borderBottom = "1px solid #343a40";
        footer.style.borderTop = "1px solid #343a40";
    } else {
        htmlDiv.setAttribute("data-bs-theme", "light");
        s;
        themeButton.src = "./sun-svgrepo-com.svg";
        navBar.style.borderBottom = "1px solid #e9ecef";
        footer.style.borderTop = "1px solid #e9ecef";
    }
}

themeButton.addEventListener("click", switchTheme);
// const welcomeMessage = document.getElementById("lmfao");
// const username = welcomeMessage.textContent
//     .replace("Welcome ", "")
//     .replace("!", "");
// console.log(username);

// display all events associated with the user
const dashboardBox = document.getElementById("dashboard");
const meetingArr = await loadAllMeetingsJSON();

function renderDashboard() {
    // const events = [{}...] array of events from db

    meetingArr.forEach((eventObject) => {
        const eventBox = document.createElement("a");
        const titleSpan = document.createElement("span");
        const descSpan = document.createElement("span");

        eventBox.classList.add(
            "col-12",
            "col-sm-6",
            "col-lg-3",
            "col-xl-2",
            "m-2",
            "p-3",
            "meeting-item"
        );
        eventBox.style.cursor = "pointer";
        eventBox.style.display = "block";
        titleSpan.textContent = eventObject["title"];
        titleSpan.classList.add("meeting-title", "text-black");
        descSpan.textContent = eventObject["description"];
        descSpan.classList.add("meeting-desc", "text-black");

        eventBox.appendChild(titleSpan);
        eventBox.appendChild(document.createElement("br"));
        eventBox.appendChild(descSpan);

        dashboardBox.appendChild(eventBox);
    });
}

renderDashboard();

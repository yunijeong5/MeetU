// Switch theme button functionality
// TODO: save theme between pages

const htmlDiv = document.querySelector("html");
const themeButton = document.getElementsByClassName("theme-icon")[0];
const navBar = document.getElementsByClassName("navbar")[0];
const footer = document.getElementById("footer");

function switchTheme() {
  const theme = htmlDiv.getAttribute("data-bs-theme");
  if (theme == "light") {
    htmlDiv.setAttribute("data-bs-theme", "dark");
    themeButton.src = "./moon-svgrepo-com.svg";
    navBar.style.borderBottom = "1px solid #343a40";
    footer.style.borderTop = "1px solid #343a40";
  } else {
    htmlDiv.setAttribute("data-bs-theme", "light");
    themeButton.src = "./sun-svgrepo-com.svg";
    navBar.style.borderBottom = "1px solid #e9ecef";
    footer.style.borderTop = "1px solid #e9ecef";
  }
}

themeButton.addEventListener("click", switchTheme);

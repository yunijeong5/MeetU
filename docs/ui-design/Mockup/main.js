const earliestPicker = document.getElementById("earliest");
const latestPicker = document.getElementById("latest");

const timeStrings = [];
for (let i = 0; i < 24; i++) {
  let timeString = i == 12 ? "12:00" : `${Number(i) % 12}:00`;
  if (i < 12) {
    timeString += " AM";
  } else {
    timeString += " PM";
  }
  timeStrings.push(timeString);
}

timeStrings.map((time, i) => {
  let opt1 = document.createElement("option");
  console.log(opt1);
  opt1.value = i; // the index
  opt1.innerHTML = time;
  earliestPicker.append(opt1);

  let opt2 = document.createElement("option");
  console.log(opt2);
  opt2.value = i; // the index
  opt2.innerHTML = time;
  latestPicker.append(opt2);
});

import { loadMeetingJSON, loadUserMeetingJSON, loadAllMeetingsJSON } from "./loadFromDB.js";
const test = await loadAllMeetingsJSON();
console.log(test);

// title and description
const titleElem = document.getElementById("event-title");
const descElem = document.getElementById("event-description");
async function renderTitleDesc() {
    // get meeting info
    let meeting = await loadMeetingJSON();
    meeting = meeting["value"];

    titleElem.textContent = meeting["title"];
    descElem.textContent = meeting["description"];
}

await renderTitleDesc();

// Poll
// Userid, eventid, send number 1 or -1.
const pollBlock = document.getElementById("poll-block");
const pollTitle = document.getElementById("poll-title");

// numLevel: num people voted + 1
export const generateColorScale = (numLevel, colorString) => {
    return chroma.scale(["white", colorString]).colors(numLevel);
};

const makeOptionVotes = (poll, userVotes) => {
    // invert userVotes. {optionK: [users who chose optionK]}
    const optionVotes = {};
    for (const option of poll["options"]) {
        optionVotes[option] = [];
    }
    // console.log("options votes: ", optionVotes);
    for (const [userName, selectedOptions] of Object.entries(userVotes)) {
        selectedOptions.forEach((option) => {
            optionVotes[option].push(userName);
        });
    }
    return optionVotes;
};

// arr: [{username: 'a', selectedTimes: Array(0), selectedOptions: Array(1)}]
// goal:
// const userVotes = {
//         Nhi: ["option 1", "option 2"],
//         Yuni: ["option 3", "option 2"],
//         James: ["option 1"],
//         Kush: ["option 2"],
// };
function makeUserVotes(arr) {
    const res = {};
    for (const o of arr) {
        res[o.username] = o.selectedOptions;
    }
    return res;
}

export function findMyData(myName, allUsers) {
    for (const o of allUsers) {
        if (o.username === myName) {
            return o;
        }
    }
}

async function renderPoll() {
    // get poll data from backend
    let meeting = await loadMeetingJSON();
    const username = meeting["username"];
    const poll = meeting["value"]["poll"];
    let userVotes = undefined;
    let optionVotes = undefined;

    // console.log("meeting, ", meeting);
    // console.log("poll, ", poll);

    let allUsers = await loadUserMeetingJSON();
    // console.log("All users", allUsers);

    let myVotes = [];
    let myTimes = [];
    if (allUsers[0] !== null) {
        userVotes = makeUserVotes(allUsers);
        // console.log("USERVOTES", userVotes);
        const myData = findMyData(username, allUsers);
        myVotes = myData.selectedOptions;
        myTimes = myData.selectedTimes;
    }

    // check if poll is defined. If not, don't populate options
    if (poll["options"].length === 0) {
        pollTitle.textContent = "Poll";
        pollBlock.classList.add("text-center");
        pollBlock.textContent = "No poll for this event!";
        return;
    }

    // Set poll title
    pollTitle.textContent = "Poll: " + poll["title"];

    // generate color scale
    const numLevel =
        userVotes !== undefined ? Object.keys(userVotes).length + 1 : 2;
    const colorScale = generateColorScale(numLevel, "0d6efd");

    // if there is previous users
    if (userVotes) {
        optionVotes = makeOptionVotes(poll, userVotes);
    }

    // TODO: user cannot vote twice for the same option

    // generate list items
    pollBlock.innerHTML = ""; // reset pollblock
    poll["options"].forEach((option) => {
        const pollOption = document.createElement("li");
        pollOption.textContent = option;
        pollOption.classList.add(
            "poll-option",
            "p-2",
            "my-2",
            "cursor-pointer",
            "text-black"
        );
        let numVotes = 0;
        if (optionVotes !== undefined) {
            numVotes = optionVotes[option].length;
            pollOption.style.background = colorScale[numVotes];
        }

        pollOption.setAttribute(
            "title",
            numVotes === 0
                ? "Vote by clicking"
                : `Voted by ${optionVotes[option]}`
        );
        // add event listner
        pollOption.addEventListener("click", async function () {
            // check if this user already clicked this option
            if (this.getAttribute("title").indexOf(username) !== -1) {
                // user already clicked option
                console.log(`${username} alreay clicked this`);
                // remove current selection
                const index = myVotes.indexOf(this.textContent);
                if (index > -1) {
                    myVotes.splice(index, 1);
                }
                const res = await fetch("/sendUserMeeting", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        selectedOptions: myVotes,
                        selectedTimes: myTimes,
                    }),
                });
            } else {
                console.log("first click!");
                // send updated info to server (which will reorganize and send to db)
                // {mid: meetingID, uid: username/userID, value: JSON.stringify({selectedTimes: [...], selectedOptions: [..updated..]})}
                myVotes.push(this.textContent);

                const res = await fetch("/sendUserMeeting", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        selectedOptions: myVotes,
                        selectedTimes: myTimes,
                    }),
                });
            }
            await renderPoll(); // to recolor options
            await renderSummary(); // update summary bests
        });
        pollBlock.appendChild(pollOption);
    });
}

await renderPoll();

// Share Event (copy url)
const copyURL = document.getElementById("copy-url");

// replace with functioning URL.
copyURL.addEventListener("click", async () => {
    const meeting = await loadMeetingJSON();
    const url = `http://localhost:4444/getMID/${meeting.mid}`;
    navigator.clipboard.writeText(url);
});

// Summary
const participants = document.getElementById("participants");
const bestPollsText = document.getElementById("best-polls");
export async function renderSummary() {
    // clear summaryblock
    participants.innerHTML = "";
    bestPollsText.innerHTML = "";

    // participants
    const allUsers = await loadUserMeetingJSON();
    // console.log(allUsers);

    if (allUsers[0] !== null) {
        const users = allUsers
            .filter(
                (o) =>
                    o.selectedOptions.length > 0 || o.selectedTimes.length > 0
            )
            .map((o) => o.username);

        // console.log("users***", users);
        const userVotes = makeUserVotes(allUsers);
        // console.log("USERVOTES", userVotes);
        users.forEach((option) => {
            const div = document.createElement("div");
            div.classList.add("m-1", "best-bubble", "pill-corner");
            div.textContent = option;
            participants.appendChild(div);
        });
        // choose best option
        const optionsFreq = {};
        for (const arr of Object.values(userVotes)) {
            arr.forEach((choice) => {
                if (choice in optionsFreq) {
                    optionsFreq[choice] += 1;
                } else {
                    optionsFreq[choice] = 1;
                }
            });
        }
        const maxFreq = Math.max(...Object.values(optionsFreq));
        let bestOptions = [];
        for (const [option, freq] of Object.entries(optionsFreq)) {
            if (freq === maxFreq) {
                bestOptions.push(option);
            }
        }
        bestOptions.forEach((option) => {
            const op = document.createElement("div");
            op.classList.add("m-1", "best-bubble", "pill-corner");
            op.textContent = option;
            bestPollsText.appendChild(op);
        });
    }
}

await renderSummary();

// add event listener to table cells
// const userTable = document.getElementById("user-table");
// const groupTable = document.getElementById("group-table");

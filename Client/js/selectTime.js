import { loadMeetingJSON, loadUserMeetingJSON } from "./loadFromDB.js";

//TODO: remove later... just for testing fetched data
// const meeting = await loadMeetingJSON();
const test = await loadUserMeetingJSON();
// console.log("result: ", result);
console.log("test: ", test);

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

renderTitleDesc();

// Poll
// Userid, eventid, send number 1 or -1.
const pollBlock = document.getElementById("poll-block");
const pollTitle = document.getElementById("poll-title");

// numLevel: num people voted + 1
const generateColorScale = (numLevel, colorString) => {
    return chroma.scale(["white", colorString]).colors(numLevel);
};

const makeOptionVotes = (poll, userVotes) => {
    // invert userVotes. {optionK: [users who chose optionK]}
    const optionVotes = {};
    for (const option of poll["options"]) {
        optionVotes[option] = [];
    }
    for (const [userName, selectedOptions] of Object.entries(userVotes)) {
        selectedOptions.forEach((option) => {
            optionVotes[option].push(userName);
        });
    }
    return optionVotes;
};

async function renderPoll() {
    // get poll data from backend
    // let poll = await loadMeetingJSON();
    // poll = poll["value"]["poll"];

    // mock data below
    const poll = {
        title: "Hi!",
        options: ["option 1", "option 2", "option 3", "option 4"],
    };

    // const mockPollVotes['selected_options'] = [list of selected options]
    // const userMeeting = load from db
    // [{name: username, selectedTimes: ["..."], selectedOptions: [option1, option2]}]
    // make above into the format below.
    const userVotes = {
        Nhi: ["option 1", "option 2"],
        Yuni: ["option 3", "option 2"],
        James: ["option 1"],
        Kush: ["option 2"],
    };

    // check if poll is defined. If not, don't populate options
    if (poll["options"].length === 0) {
        pollTitle.textContent = "Poll";
        pollBlock.classList.add("text-center");
        pollBlock.textContent = "No poll for this event!";
        return;
    }

    // generate color scale
    const colorScale = generateColorScale(
        Object.keys(userVotes).length + 1,
        "0d6efd"
    );

    // Set poll title
    pollTitle.textContent = "Poll: " + poll["title"];

    const optionVotes = makeOptionVotes(poll, userVotes);

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
        const numVotes = optionVotes[option].length;
        pollOption.style.background = colorScale[numVotes];
        pollOption.setAttribute(
            "title",
            numVotes === 0
                ? "Vote by clicking"
                : `Voted by ${optionVotes[option]}`
        );
        // add event listner
        pollOption.addEventListener("click", function () {
            // get current user's username
            const username = "Yuni";
            // check if this user already clicked this option
            if (this.getAttribute("title").indexOf(username) !== -1) {
                // user already clicked option
                console.log(`${username} alreay clicked this`);
                return;
            } else {
                console.log("first click!");
                // send updated info to server (which will reorganize and send to db)
                // {mid: meetingID, uid: username/userID, value: JSON.stringify({selectedTimes: [...], selectedOptions: [..updated..]})}
            }
            renderPoll(); // to recolor options
            renderSummary(); // update summary bests
        });
        pollBlock.appendChild(pollOption);
    });
}

renderPoll();

// Share Event (copy url)
const copyURL = document.getElementById("copy-url");

copyURL.addEventListener("click", () => {
    const url = "http://meetu.com/mid=meetingID";
    navigator.clipboard.writeText(url);
});

// Summary
const participants = document.getElementById("participants");
const bestPollsText = document.getElementById("best-polls");
async function renderSummary() {
    // clear summaryblock
    participants.innerHTML = "";
    bestPollsText.innerHTML = "";

    // participants
    // mock data
    const users = ["Yuni", "Nhi", "James", "Kush"];
    users.forEach((option) => {
        const div = document.createElement("div");
        div.classList.add("m-1", "best-bubble", "pill-corner");
        div.textContent = option;
        participants.appendChild(div);
    });

    // const meeting = await loadMeetingJSON();
    // const userMeeting = await loadUserMeetingJSON();

    // mock data
    const userVotes = [
        ["option 1", "option 2"],
        ["option 3", "option 2"],
        ["option 1"],
        ["option 2"],
    ];

    // choose best option
    const optionsFreq = {};
    for (const arr of userVotes) {
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

renderSummary();

// add event listener to table cells
const userTable = document.getElementById("user-table");
const groupTable = document.getElementById("group-table");

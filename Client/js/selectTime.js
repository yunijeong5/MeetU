// import { UserDB } from "../../Server/database.js";
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

function renderPoll() {
    // get poll data from backend
    // const mockMeeting['poll'] = {json}
    const poll = {
        title: "Hi!",
        options: ["option 1", "option 2", "option 3", "option 4"],
    };
    // const poll = {};

    // const mockPollVotes['selected_options'] = [list of selected options]
    // const userMeeting = load from db
    // [{name: username, selectedTimes: ["..."], selectedOptions: [option1, option2]}]
    // make above into the format below.
    const userVotes = {
        Nhi: ["option 1", "option 2"],
        Yuni: ["option 3"],
        James: ["option 1"],
        Kush: ["option 2"],
    };

    // check if poll is defined. If not, don't populate options
    if (Object.keys(poll).length === 0) {
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
            "cursor-pointer"
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

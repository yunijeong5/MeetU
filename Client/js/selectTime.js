// function populateFields() {
//     let sentData = JSON.parse(localStorage.getItem("serializedRes"));
//     console.log(sentData);
// }
// populateFields();

// Poll
// Userid, eventid, send number 1 or -1.
const pollBlock = document.getElementById("poll-block");
const pollTitle = document.getElementById("poll-title");

const generateColorScale = (numLevel) => {
    const themeBlue = "007bff"; // #007bff
    const colorList = chroma.scale(["white", themeBlue]).colors(numLevel);
    console.log(colorList);
    // for (let i = 0; i < numLevel; i++) {}
};

const loadPoll = () => {
    // get poll data from backend
    // const mockMeeting['poll'] = {json}

    const poll = { title: "Hi!", options: ["option 1", "option 2"] };
    // const poll = {};
    // const mockPollVotes['selected_options'] = [list of selected options]
    const pollVotes = {
        Nhi: ["option 1", "option 2"],
        Yuni: ["option 3"],
        James: ["option 1"],
        Kush: ["option 2"],
    };

    // check if poll is defined
    if (Object.keys(poll).length === 0) {
        pollTitle.textContent = "Poll";
        pollBlock.classList.add("text-center");
        pollBlock.textContent = "No poll for this event!";
        return;
    }

    pollTitle.textContent = poll["title"];
    // generate list items
    poll["options"].forEach((option) => {
        const pollOption = document.createElement("li");
        pollOption.textContent = option;
        pollOption.classList.add("poll-option");
        pollOption.classList.add("p-2");
        pollOption.classList.add("my-2");
        pollOption.classList.add("cursor-pointer");
        pollOption.setAttribute("title", "Vote by clicking");
        pollBlock.appendChild(pollOption);
    });
};

loadPoll();
generateColorScale(5);

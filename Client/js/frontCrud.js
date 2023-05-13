// send jsonString to server
export async function createNewEvent(jsonString) {
    console.log("frontCrud Called; createnewevent");
    console.log("json from form: ", jsonString);
    const response = await fetch("/createEvent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: jsonString,
    });

    if (response.status === 404) {
        console.log("Bad fetch request");
        return null;
    }

    const data = await response.json();
    return data;
}


export async function readEvent(id) {
    const response = await fetch(`/readEvent/read?id=${id}`, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
}
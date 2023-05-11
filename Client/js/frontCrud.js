// send jsonString to server
export async function createNewEvent(jsonString) {
    console.log("frontCrud Called");
    console.log("json from form: ", jsonString);
    const response = await fetch("/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: jsonString,
    });

    console.log("a");

    if (response.status === 404) {
        console.log("Bad fetch request");
        return null;
    }

    console.log("b");

    const data = await response.json();

    console.log("c");
    return data;
}

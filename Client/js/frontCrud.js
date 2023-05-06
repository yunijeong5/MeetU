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
    const data = await response.json();
    return data;
}
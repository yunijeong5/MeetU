// Removed import and added pouchDB script tag in index.html. Need to test if it will work.
// UPDATE: It doesn't work. Also problemetic cuz express cannot be imported either.
import express, { response } from "express";
import logger from "morgan";
import PouchDB from "pouchdb";

const db = new PouchDB("events");

// create event
async function createEvent(event) {
    try {
        console.log("createEvent called");
        const response = await db.post(event);
        return response;
    } catch (error) {
        console.error(error);
    }
}

// read
async function getEvent(id) {
    try {
        const event = await db.get(id);
        return event;
    } catch (error) {
        console.error(error);
    }
}

// update
async function updateEvent(event) {
    try {
        const response = await db.put(event);
        return response;
    } catch (error) {
        console.error(error);
    }
}

// delete
async function deleteEvent(event) {
    try {
        const response = await db.remove(event);
        return response;
    } catch (error) {
        console.error(error);
    }
}

// express settings
const app = express();
const port = 3000;
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// serve static frontend files
app.use("/", express.static("../Client"));

// send data and stuff
app.post("/createEvent", async (request, response) => {
    console.log("app.post /create called\n");
    const eventInfo = request.body;
    console.log(eventInfo);
    createEvent(eventInfo);
    response.send(eventInfo);
});

// error page
app.get("*", async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
});

// start server
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});

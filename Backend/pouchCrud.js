// Removed import and added pouchDB script tag in index.html. Need to test if it will work.
// UPDATE: It doesn't work. Also problemetic cuz express cannot be imported either.
// import PouchDB from "pouchdb";
import express, { response } from "express";
import logger from "morgan";

const db = new PouchDB("events");

// create event
export async function createEvent(event) {
    try {
        console.log("createEvent called");
        const response = await db.post(event);
        return response;
    } catch (error) {
        console.error(error);
    }
}

// read
export async function getEvent(id) {
    try {
        const event = await db.get(id);
        return event;
    } catch (error) {
        console.error(error);
    }
}

// update
export async function updateEvent(event) {
    try {
        const response = await db.put(event);
        return response;
    } catch (error) {
        console.error(error);
    }
}

// delete
export async function deleteEvent(event) {
    try {
        const response = await db.remove(event);
        return response;
    } catch (error) {
        console.error(error);
    }
}

import PouchDB from 'pouchdb';

const db = new PouchDB("events");

// create event
export async function createEvent(event) {
  try {
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

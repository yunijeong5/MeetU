import PouchDB from 'pouchdb';
import * as http from 'http';
import * as url from 'url';
// TODO: Need to retrieve the jsonEvnt, but this import has problems.
// import createNewEvent from '../Frontend/createEvent.js';

const db = new PouchDB('eventData');

async function create(event) {
  //  create doc (post) in pouch and move event object to db 
  const dbEvent = await db.post(event);
  // retrieve event from database
  const getEvent = await db.get(dbEvent.id);
  // return the created event
  return getEvent;
}

async function basicServer(request, response) {
  if (request.method === 'POST') {
    // Retrieve jsonEvent from createNewEvent function
    const jsonEvent = await createNewEvent();
    // create event and put into pouchDB
    const createdEvent = await create(jsonEvent);
    // return createdEvent as JSON response
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(createdEvent));
  }
}

// Start the server on port 5500.
http.createServer(basicServer).listen(5500, () => {
  console.log('Server started on port 5500');
});

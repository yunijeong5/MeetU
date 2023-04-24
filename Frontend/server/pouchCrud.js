import * as http from 'http';
import * as url from 'url';
import PouchDB from 'pouchdb';

const db = new PouchDB('eventData');

export async function create(event) {
  //  create doc (post) in pouch and move event object to db 
  const dbEvent = await db.post(JSON.parse(event));

  // return the created event
  return dbEvent;
}

async function basicServer(request, response) {
  const options = url.parse(request.url, true).query;

  if (request.url.startsWith('/create')) {
    create(response, options);
  } 
}

// Start the server on port 5500.
http.createServer(basicServer).listen(5500, () => {
  console.log('Server started on port 5500');
});

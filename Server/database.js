import "dotenv/config";
import pg from "pg";
import { v4 as uuidv4 } from "uuid";
const { Client } = pg;
const { userPG, hostPG, dbPG, pwdPG, portPG } = process.env;

export const UserDB = (dburl) => {
    const client = new Client({
        user: userPG,
        host: hostPG,
        database: dbPG,
        password: pwdPG,
        port: portPG,
        ssl: false,
    });

    return {
        connect: async () => {
            await client.connect();
            return UserQuery(client);
        },
        close: async () => {
            await client.end();
        },
    };
};
const UserQuery = (client) => {
    return {
        addEvent: async (eventJson, uid, prefJson) => {
            const queryTxt =
                "CREATE TABLE IF NOT EXISTS events ( " +
                "id SERIAL PRIMARY KEY, " +
                "event_json JSONB NOT NULL, " +
                "mid VARCHAR(50) NOT NULL, " +
                "uid VARCHAR(50) NOT NULL, " +
                "pref_json JSONB DEFAULT NULL);";
            await client.query(queryTxt);
            const mid = uuidv4();
            const { rows } = await client.query(
                `INSERT INTO events (event_json, mid, uid, pref_json) VALUES ($1, $2, $3, $4) RETURNING mid, uid`,
                [eventJson, mid, uid, prefJson]
            );
            return rows;
        },
        updateEvent: async (uid, mid, prefJson) => {
            const queryTxt = `
            CREATE TABLE IF NOT EXISTS events (
              id SERIAL PRIMARY KEY,
              event_json JSONB NOT NULL,
              mid VARCHAR(50) NOT NULL,
              uid VARCHAR(50) NOT NULL,
              pref_json JSONB DEFAULT NULL
            );
          `;
            await client.query(queryTxt);

            const existingRecord = await client.query(
                "SELECT mid, uid FROM events WHERE mid = $1 AND uid = $2",
                [mid, uid]
            );

            if (existingRecord.rows.length > 0) {
                await client.query(
                    "UPDATE events SET pref_json = $1 WHERE mid = $2 AND uid = $3",
                    [prefJson, mid, uid]
                );

                return prefJson;
            }

            return -1;
        },
        createUser: async (username, password) => {
            const uid = uuidv4();
            const initText = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(30) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                uid VARCHAR(50) UNIQUE NOT NULL
            );`;
            await client.query(initText);
            const queryText = `
                INSERT INTO users (username, password, uid) VALUES ($1, $2, $3) RETURNING *;
            `;
            const res = await client.query(queryText, [
                username,
                password,
                uid,
            ]);
            return res.rows[0];
        },
        addUserMeeting: async (uid, mid) => {
            const initText = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                mid VARCHAR(50) NOT NULL,
                uid VARCHAR(50) NOT NULL,
            );`;
            await client.query(initText);
            const queryText = `
                INSERT INTO users (uid, mid) VALUES ($1, $2) RETURNING *;
            `;
            const res = await client.query(queryText, [uid, mid]);
            return res.rows[0];
        },
        getUser: async (username) => {
            const initText = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(30) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                uid VARCHAR(50) UNIQUE NOT NULL
            );`;
            await client.query(initText);
            const queryText = `SELECT * FROM users WHERE username = $1;`;
            const res = await client.query(queryText, [username]);
            // checks if the username is not found
            return res.rows.length > 0 ? res.rows[0] : null;
        },
        getMeeting: async (uid, mid) => {
            const initText = `
                CREATE TABLE IF NOT EXISTS events (
                    id SERIAL PRIMARY KEY,
                    event_json JSONB NOT NULL,
                    mid VARCHAR(50) NOT NULL,
                    uid VARCHAR(50) NOT NULL
                );
            `;
            await client.query(initText);
            const queryText = `SELECT * FROM events WHERE uid = $1 AND mid = $2;`;
            const res = await client.query(queryText, [uid, mid]);
            return res.rows.length > 0 ? res.rows[0] : null;
        },
        getAllPref: async (mid) => {
            const initText = `
                CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                event_json JSONB NOT NULL,
                mid VARCHAR(50) NOT NULL,
                uid VARCHAR(50) NOT NULL,
                pref_json JSONB DEFAULT NULL
                );`;
            await client.query(initText);
            const pref = await client.query(
                `SELECT pref_json FROM events WHERE mid = $1;`,
                [mid]
            );
            return pref.rows.map((row) => row.pref_json);
        },
        getAllMeetings: async (uid) => {
            const initText = `
                CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                event_json JSONB NOT NULL,
                mid VARCHAR(50) NOT NULL,
                uid VARCHAR(50) NOT NULL,
                pref_json JSONB DEFAULT NULL
            );`;
            await client.query(initText);
            const events = await client.query(
                `SELECT event_json FROM events WHERE uid = $1;`,
                [uid]
            );
            return events.rows.map((row) => row.event_json);
        },
        // adds a new event if user clicks on link
        shareUserMID: async (uid, mid) => {
            // updates uid with a new event_json
            const res = await client.query(
                `SELECT event_json, pref_json FROM events WHERE mid=$1`,
                [mid]
            );
            const event = res.rows[0].event_json;
            const pref = res.rows[0].pref_json;

            const insertEvent = await client.query(
                "INSERT INTO events (event_json, mid, uid, pref_json) VALUES ($1, $2, $3, $4) RETURNING id",
                [event, mid, uid, pref]
            );
            return insertEvent.rows;
        }
    };
};

import 'dotenv/config';
import pg from 'pg';
import {v4 as uuidv4 } from 'uuid';
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
        // TODO: add uid in param
        addEvent: async (eventJson, uid) => {
            const queryTxt = 'CREATE TABLE IF NOT EXISTS events ( ' +
                'id SERIAL PRIMARY KEY, ' +
                'event_json JSONB NOT NULL, ' +
                'mid VARCHAR(50) NOT NULL, ' +
                'uid VARCHAR(50) NOT NULL ' +
                ');';
            await client.query(queryTxt);
            const mid = uuidv4();
            const { rows } = await client.query(`INSERT INTO events (event_json, mid, uid) VALUES ($1, $2, $3) RETURNING id`, [eventJson, mid, uid]);
            return rows[0].mid;
        },

        readEvent: async (id) => {
            const { rows } = await client.query(`SELECT * FROM events WHERE id = $1`, [id]);
            return rows[0];
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
            const res = await client.query(queryText, [username, password, uid]);
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
        getMeeting: async (uid) => {
            const initText = `
                CREATE TABLE IF NOT EXISTS events (
                    id SERIAL PRIMARY KEY,
                    event_json JSONB NOT NULL,
                    mid VARCHAR(50) NOT NULL,
                    uid VARCHAR(50) NOT NULL
                );
            `;
            await client.query(initText);
            const queryText = `SELECT * FROM events WHERE uid = $1;`;
            const res = await client.query(queryText, [uid]);
            return res.rows.length > 0 ? res.rows[0] : null;
        },
        //TODO: (?)
        getMID: async (event_json) => {
            const queryText = 'SELECT * from events WHERE event_json = $1;';
            const res = await client.query(queryText, [event_json]);
            return res.rows.length > 0 ? res.rows[0] : null;
        }
    };
  };
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
        addEvent: async (eventJson) => {
            const queryTxt = `
                CREATE TABLE IF NOT EXISTS events (
                    id SERIAL PRIMARY KEY,
                    event_json JSONB NOT NULL, 
                    mid VARCHAR(50) NOT NULL
                )
            `;
            await client.query(queryTxt);
            const mid = uuidv4();
            //const { rows } = await client.query(`INSERT INTO events (event_json) VALUES ($1) RETURNING id`, [eventJson], mid);
            const { rows } = await client.query(`INSERT INTO events (event_json, mid) VALUES ($1, $2) RETURNING id`, [eventJson, mid]);
            return rows[0].id;
        },

        readEvent: async (id) => {
            const { rows } = await client.query(`SELECT * FROM events WHERE id = $1`, [id]);
            return rows[0];
        },
        
        createUser: async (username, password) => {
            const initText = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(30) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );`;
            await client.query(initText);
            const queryText = `
            INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;
            `;
            const res = await client.query(queryText, [username, password]);
            return res.rows[0];
        },

        getUser: async (username) => {
            const initText = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(30) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );`;
            await client.query(initText);
            const queryText = `SELECT * FROM users WHERE username = $1;`;
            const res = await client.query(queryText, [username]);
            // checks if the username is not found
            return res.rows.length > 0 ? res.rows[0] : null;
        },
        
        // TODO: get the mid and uid from database to any page on index.js (like selectTime and selectTimePoll)
        getMID: async (user) => {
            const { table } = await client.query(`SELECT mid FROM events WHERE id = $1`, [user]);
            return table[0]?.mid;
        },
        
        getUID: async (user) => {
            const { table } = await client.query(`SELECT id FROM events WHERE mid = $1`, [user]);
            return table[0]?.id;
        },

    };
  };
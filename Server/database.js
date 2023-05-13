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

        init: async () => {
            const queryText = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(30) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );`;
            await client.query(queryText);
        },
        
        createUser: async (username, password) => {
            const queryText = `
            INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;
            `;
                const res = await client.query(queryText, [username, password]);
                return res.rows[0];
        },

        getUser: async (username) => {
            const queryText = `SELECT * FROM users WHERE username = $1;`;
            const res = await client.query(queryText, [username]);
            return res.rows[0];
        },
    };
  };

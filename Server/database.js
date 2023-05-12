import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

export const UserDB = (dburl) => {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'badpwd',
        port: 5432,
        ssl: false, // Disable SSL
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
        // TODO: might have to update queryText
            const queryText = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(30) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `;
            await client.query(queryText);
        },
        createUser: async (username, password) => {
            const queryText = `
        INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;
      `;
            const res = await client.query(queryText, [username, password]);
            return res.rows[0];
        },
        
        readUsernameAndPassword: async (username, password) => {
            const queryText = `
        SELECT * FROM users WHERE username = $1 AND password = $2;
      `;
            const res = await client.query(queryText, [username, password]);
            return res.rows[0];
        },
    };
};

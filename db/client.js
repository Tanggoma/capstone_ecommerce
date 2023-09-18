const { Client } = require('pg');

// Change the DB_NAME string to whatever your group decides on
const DB_NAME = 'capstone';

const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`;

// Define the options for the client
const clientOptions = {
    connectionString: DB_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
};

// Create a new client instance with the options
const client = new Client(clientOptions);

// Connect the client to the database
client.connect()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(error => {
        console.error('Error connecting to the database:', error);
    });

module.exports = client;

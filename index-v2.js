require('dotenv').config();


// necessary variables 
const express = require('express');
const cors = require('cors')
const app = express();
const { Client } = require('pg')
const dbPass = process.env.DB_PASS;
const PORT = process.env.PORT;

let client = Client({
    user: 'postgres',
    host: 'localhost', 
    database: 'Notebook_API',
    password: dbPass,
    port: 5432,
});

client.connect();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log("Hello, this server is currently running on your macbook. Nice.")
});

app.listen(PORT, () => {
    console.log(`Server started running on port: ${PORT}`)
})
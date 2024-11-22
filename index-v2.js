require('dotenv').config();


// necessary variables 
const express = require('express'); // import express module
const cors = require('cors')    // import cors 
const app = express();
const { Client } = require('pg')
const dbPass = process.env.DB_PASS;
const PORT = process.env.PORT;

let client = new Client({
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
    res.send("Hello, this server is currently running on your macbook. Nice.")
});

app.listen(PORT, () => {
    console.log(`Server started running on port: ${PORT}`)
});

app.post('/submit', async (req, res)=>{
    const {title, description} = req.body;
    const query = 'INSERT INTO notebook(title, description) VALUES($1, $2) RETURNING *';
    const values = [title, description];
    const result = await client.query(query,values);

    res.json({ message: "Data successfully received!" }); // Express response
});
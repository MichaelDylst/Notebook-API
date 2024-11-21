// checken of een server nog in gebruik is: 
// lsof -i :3000
// server afsluiten
// kill -9 <PID> -> PID is het servernummer

const express = require("express");
const cors = require('cors');
const app = express();
const { Client } = require('pg');
const dbPass = process.env.DB_PASS;
require('dotenv').config();

// database-verbinding

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Notebook_API',
    password: 'password',
    port: 5432,
});

async function checkConnection() {
    try {
      await client.connect();
      console.log('Connected with database!');
      client.end();  // Sluit de verbinding
    } catch (err) {
      console.error('Connection Failed:', err.message);
    }
  }
  
  checkConnection();

// gebruik CORS
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
console.log(PORT);
// eenvoudige route 

app.get('/', (req, res) => {
    res.send('Hi! This server is currently running.')
});

app.post('/submit', (req, res) => {
    console.log(req.body);
    res.json({message: "Data succesfully received!"})
})

app.listen(PORT, () => {
    console.log(`Server running on:  https://localhost:${PORT}`);
})
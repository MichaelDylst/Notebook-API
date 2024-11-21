// checken of een server nog in gebruik is: 
// lsof -i :3000
// server afsluiten
// kill -9 <PID> -> PID is het servernummer
require('dotenv').config();

const express = require("express");
const cors = require('cors');
const app = express();
const { Client } = require('pg');
const dbPass = process.env.DB_PASS;
console.log(dbPass)


// database-verbinding

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Notebook_API',
    password: dbPass,
    port: 5432,
});

client.connect();

/*async function checkConnection() {
    try {
      await client.connect();
      console.log('Connected with database!');
      client.end();  // Sluit de verbinding
    } catch (err) {
      console.error('Connection Failed:', err.message);
    }
  }
  checkConnection();*/

// gebruik CORS
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
console.log(PORT);
// eenvoudige route 

app.get('/', (req, res) => {
    res.send('Hi! This server is currently running.')
});

app.post('/submit', async (req, res) => {


})

app.listen(PORT, () => {
    console.log(`Server running on:  https://localhost:${PORT}`);
})
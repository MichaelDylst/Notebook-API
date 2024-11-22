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
const PORT = process.env.PORT;


// database-verbinding

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Notebook_API',
    password: dbPass,
    port: 5432,
});

client.connect();

// gebruik CORS
app.use(cors());
app.use(express.json());

app.get('/notebook', async (req, res) => {
    res.send('Hi! This server is currently running.')
    try{
      const result = await client.query('SELECT * FROM notebook');
      res.json = (result.rows); // res = response -> zet de response om in een json die het het de rows van de query weergeeft.
    }catch(error){
      console.error("Error fetching data: ", error);
      res.status(500).send('Server Error');
    }

});

app.listen(PORT, () => {
    console.log(`Server running on:  https://localhost:${PORT}`);
})

app.post('/submit', async (req, res) => {
    const {title, description} = req.body;
    const query = 'INSERT INTO notebook(title, description) VALUES($1, $2) RETURNING *';
    const values = [title, description];
    const result = await client.query(query, values)

    // RETURN SUCCESSFULL RESPONSE 
    res.json({message: 'Data succesfully saved!', note: result.rows[0]})
})









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
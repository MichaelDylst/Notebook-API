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

app.get('/', (req,res) => {
    res.send('Hi! This server is currently running.')
});

app.get('/notebook', async (req, res) => {
    try{
      const result = await client.query('SELECT * FROM notebook');
      res.json(result.rows); // res = response -> zet de response om in een json die het het de rows van de query weergeeft.
    }catch(error){
      console.error("Error fetching data: ", error);
      res.status(500).send('Server Error');
    }
});

app.patch('/update', async (req,res) => {
  try{
    const {id, title, description} = req.body;
    const query =  `UPDATE notebook SET title= $2, description= $3 WHERE id = $1`;
    const values = [id, title, description];
    const result = await client.query(query, values);

    res.json({message: 'Data successfully updated!', note: result.rows[0]})

  } catch(error){
    console.error("Error fetching update data", error)
  }
})

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
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();
const { Client } = require('pg');
const dbPass = process.env.DB_PASS;
const PORT = process.env.PORT;


const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Notebook_API',
    password: dbPass,
    port: 5432,
});

client.connect();

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send('Hi! This server is currently running.')
});

app.get('/notebook', async (req, res) => {
    try{
      const result = await client.query('SELECT * FROM notebook ORDER BY id ASC');
      res.json(result.rows);
    }catch(error){
      console.error("Error fetching data: ", error);
      res.status(500).send('Server Error');
    }
});

app.delete('/delete', async (req, res) =>{
    const {id} = req.body;
    const query = 'DELETE FROM notebook WHERE id = $1';
    const values = [id];
    const result = await client.query(query, values);

    res.json({message: 'Data successfully deleted', note: result.rows[0]})
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

    res.json({message: 'Data succesfully saved!', note: result.rows[0]})
})

require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const dbPass = process.env.DB_PASS;
const PORT = process.env.PORT;
const JWT_KEY = process.env.JWT_SECRET;


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
    const {title, description, account_id} = req.body;
    const query = 'INSERT INTO notebook(title, description, account_id) VALUES($1, $2, $3) RETURNING *';
    const values = [title, description, account_id];
    const result = await client.query(query, values)

    res.json({message: 'Data succesfully saved!', note: result.rows[0]})
})

app.post('/createUser', async(req, res) => {
  const {username, password} = req.body;
  try{
    const queryCheck = 'SELECT * FROM account WHERE user_name = $1';
    const valueCheck = [username];
    const resultCheck = await client.query(queryCheck, valueCheck);
    if(resultCheck.rows.length > 0 ){
      return res.status(400).json({error: 'Username already exists.'});
    }else{
      const generatedSalt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, generatedSalt);
      const query = 'INSERT INTO account (user_name, password) VALUES ($1,$2) RETURNING account_id';
      const values = [username, hashedPassword];
      const result = await client.query(query, values);
      res.json({message: 'Data succesfully saved!', note: result.rows[0]})
    } }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration Failed'});
  }
});

app.get('/fetchUsers', async (req,res) => {
  try{
    const result = await client.query('SELECT * FROM account ORDER BY account_id ASC');
    res.json(result.rows);
  } catch(error){
    console.log(error)
  }
});

app.post('/login', async(req,res) => {
  const{username, password} = req.body;
  try{
    const queryCheck = 'SELECT * FROM account WHERE user_name = $1';
    const valueCheck = [username];
    const checkResult = await client.query(queryCheck, valueCheck)
    if (checkResult.rows.length === 0){
      return res.status(400).json({error: 'Invalid username or password.'})
    }else{
      const account = checkResult.rows[0];
      const passwordMatch = await bcrypt.compare(password, account.password)
      if(!passwordMatch){
        return res.status(400).json({ error: 'Invalid username or password.' })
      };
      const payload = {
        "account_id" : account.account_id,
        "username": account.user_name
      }
      const syncToken = jwt.sign(payload, JWT_KEY);
      return res.status(200).json({success: "You have now been logged in.", syncToken })
    }
  }catch(error){
    res.status(500).json({error: 'Login Failed'})
  }
})

app.patch('/changePassword', async (req,res) => {
    const {user_id, oldPass, newPass} = req.body;
    try{
      const queryCheck = 'SELECT password FROM account WHERE account_id = $1'
      const valueCheck = [user_id];
      const checkResult = await client.query(queryCheck, valueCheck);
      const account = checkResult.rows[0];
      const passwordMatch = await bcrypt.compare(oldPass, account.password);
      if(passwordMatch){
        const generatedSalt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPass, generatedSalt);
        const valuesChange = [user_id, hashedPassword]
        const queryChange = 'UPDATE account SET password = $2 WHERE account_id = $1 RETURNING account_id, user_name';
        const result = await client.query(queryChange, valuesChange)
        res.json({message: 'Data succesfully saved!', note: result.rows[0]})
      }
    }catch(error){
      console.error(error);
      res.status(500).json({ error: 'Password Change Failed'});
    }
});


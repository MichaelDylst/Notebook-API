// checken of een server nog in gebruik is: 
// lsof -i :3000
// server afsluiten
// kill -9 <PID> -> PID is het servernummer

const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// gebruik CORS
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
console.log(PORT);
// eenvoudige route 

app.get('/', (req, res) => {
    res.send('Whats up server!')
});

app.post('/submit', (req, res) => {
    console.log(req.body);
    res.json({message: "Data succesfully received!"})
})

app.listen(PORT, () => {
    console.log(`Server draait op https://localhost:${PORT}`);
})
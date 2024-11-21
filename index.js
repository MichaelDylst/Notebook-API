// checken of een server nog in gebruik is: 
// lsof -i :3000
// server afsluiten
// kill -9 <PID> -> PID is het servernummer

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// eenvoudige route 

app.get('/', (req, res) => {
    res.send('Whats up server!')
});

app.listen(PORT, () => {
    console.log(`Server draait op https://localhost:${PORT}`);
})
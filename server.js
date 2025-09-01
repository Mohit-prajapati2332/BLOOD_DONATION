const express = require('express');
const path = require('path');
const { readFile } = require('fs');
const app = express();
const port = 3000;

// Serve static files from "public" or your project root
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname,'blood.html'));
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,  'bdlogin.html'));
});


app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname,  'bdresister.html'));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

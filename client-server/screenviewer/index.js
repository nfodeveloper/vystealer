const express = require('express');
const http = require('http');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 1337;

let screens = {};
let connections = {};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('screenshot'), (req, res) => {
  const ip = req.body.ip;
  if (req.file) {
    screens[ip] = req.file.buffer;
    connections[ip] = true;
    res.status(200).send('Screenshot received');
  } else {
    res.status(400).send('No screenshot uploaded');
  }
});

app.get('/:ip', (req, res) => {
  const { ip } = req.params;
  if (screens[ip]) {
    res.setHeader('Content-Type', 'image/png');
    res.send(screens[ip]);
  } else {
    res.sendStatus(404);
  }
});

app.get('/status/:ip', (req, res) => {
  const { ip } = req.params;
  if (connections[ip]) {
    res.json({ connected: true });
  } else {
    res.json({ connected: false });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const path = require('path');
const fs = require('fs');
const router = require('express').Router()
const PORT = 3001;
const app = express();

const dbFileName = path.join(__dirname,'/db/db.json')
const dbFile = require(dbFileName)

const uuid = require('uuid');
const {v4 : uuidv4} = require('uuid')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes/:id', (req, res) => {
  const note = dbFile.find(o => o.id === req.params.id);
  res.json(note);
  console.info(`${req.method} request received to get review ${req.params.id}`);
});

app.get('/api/notes', (req, res) => {
  res.json(dbFile);
  console.info(`${req.method} request received to get reviews`);
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a review`);
  const { id, title, text } = req.body;
  if (title && text) {
    const newNote = {
      id: uuidv4(),
      title, 
      text,
    };
    const noteString = newNote;
    fs.readFile(dbFileName, function (err, data) {
      var allNotes = dbFile
      allNotes.push(noteString)
      fs.writeFile(dbFileName, JSON.stringify(allNotes), function (err) {
        if (err) throw err;
        console.log('Saved!');
        res.end()
      });
    })
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

// basic requirements
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = require('express').Router()
const PORT = 3001;
const app = express();

// require the db JSON file that holds all the notes
const dbFileName = path.join(__dirname,'/db/db.json')
const dbFile = require(dbFileName)

// Helper method for generating unique ids
const uuid = require('uuid');
const {v4 : uuidv4} = require('uuid')
// const { v1: uuidv1 } = require('uuid');


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


// GET request for reviews
app.get('/api/notes', (req, res) => {
  res.json(dbFile);
  console.info(`${req.method} request received to get reviews`);
});

// POST request to add a review
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { id, title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      id: uuidv4(),
      title, 
      text,
    };

    // Convert the data to a string so we can save it
    const noteString = newNote;


    // Write the string to a file
    fs.readFile(dbFileName, function (err, data) {
      var allNotes = dbFile
      allNotes.push(noteString)
      
      fs.writeFile(dbFileName, JSON.stringify(allNotes), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    })
  } else {
    res.status(500).json('Error in posting review');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

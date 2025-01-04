const express = require("express");
const path = require("path");
const fs = require("fs");
const router = require("express").Router();
const { Sequelize } = require("sequelize");
const PORT = process.env.PORT || 3001;
const app = express();

const dbFileName = path.join(__dirname, "/db/db.json");
const dbFile = require(dbFileName);

const uuid = require("uuid");
const { v4: uuidv4 } = require("uuid");

// Initialize Sequelize
const sequelize = new Sequelize("note_taker", "note_user", "password", {
  host: "localhost",
  dialect: "mysql", // or any other dialect you are using
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// endpoints
// GET /notes - Should the titles of the notes
// GET /notes/:id - Should return add data for a single note
// POST /notes/:id - Should add/modify a note
// DELETE /notes - Should delete a note

app.get("/notes", (req, res) => {
  if (dbFile.length === 0) {
    return res.json({ message: "No notes found" });
  }
  
  // get the title and id of each note
  const noteTitles = dbFile.map(({ title, id }) => ({ title, id }));
  res.json(noteTitles);
});

app.get("/notes/:id", (req, res) => {
  const note = dbFile.find((note) => note.id === req.params.id);
  if (!note) {
    res.json({ message: "Note of id '" + req.params.id + "' not found" });
  } else {
    res.json(note);
  }
});

app.post("/notes/:id", (req, res) => {
  // if id exists, update note
  const noteIndex = dbFile.findIndex((note) => note.id === req.params.id);
  if (noteIndex !== -1) {
    console.log(`Updating note with ID: ${req.params.id}`);
    dbFile[noteIndex] = req.body;
  } else {
    req.body.id = uuidv4();
    console.log(`Creating new note with ID: ${req.body.id}`);
    dbFile.push(req.body);
  }
  fs.writeFile(dbFileName, JSON.stringify(dbFile, null, 2), (err) =>
    err ? console.error(err) : console.log("Note saved!")
  );
  res.json(req.body);
});

app.delete("/notes/:id", (req, res) => {
  const noteIndex = dbFile.findIndex((note) => note.id === req.params.id);
  if (noteIndex === -1) {
    res.status(404).json({ error: `Note with ID '${req.params.id}' not found.` });
  } else {
    dbFile.splice(noteIndex, 1);
    fs.writeFile(dbFileName, JSON.stringify(dbFile, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete the note." });
      } else {
        res.status(200).json({ message: "Note deleted successfully." });
      }
    });
  }
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(
      `\nServer running on port ${PORT}. Visit http://localhost:${PORT} and create an account!`
    )
  );
});

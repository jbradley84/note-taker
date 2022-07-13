const fs = require('fs');
const path = require('path');
const { notes } = require('./db/db.json');
const express = require('express');
//const exp = require('constants');
const PORT = process.env.PORT || 3001;
const app = express();

// MIDDLEWARE
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));


// NOTES FUNCTIONS
function findById(id, notesArray) {
   const result = notesArray.filter(note => note.id === id)[0];
   return result;
}

function createNewNote(body, notesArray) {
   const note = body;
   notesArray.push(note);
   fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify({ notes: notesArray }, null, 2)
   );

   return note;
}

function validateNote(note) {
   if (!note.title || typeof note.title !== 'string') {
      return false;
   }
   if (!note.text || typeof note.text !== 'string') {
      return false;
   }
   return true;
}


// API ROUTES
// get request to RETREIVE NOTES
app.get('/api/notes', (req, res) => {
   console.log(notes);
   res.json(notes);
});

// get request to RETRIEVE SINGLE NOTE by ID
app.get('/api/notes/:id', (req, res) => {
   const result = findById(req.params.id, notes);
   if (result) {
      res.json(result);
   } else {
      res.send(404);
   }
})

// post request to ADD NEW NOTE
app.post('/api/notes', (req, res) => {
   // set id based on what the next index of the array will be
   req.body.id = notes.length.toString();

   // if any data in req.body is incorrect, send 400 error back
   if (!validateNote(req.body)) {
      res.status(400).send('The note is not properly formatted.');
   } else {
      // add note to json file and notes array in this function
      const note = createNewNote(req.body, notes);
      res.json(note);
   }
});


// HTML ROUTES
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
   res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
   console.log(`API server now on port ${PORT}!`);
});
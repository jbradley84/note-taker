const fs = require('fs');
const path = require('path');
const { notes } = require('./db/db.json');
const express = require('express');
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

// post request to PRINT NOTES to page
app.post('/api/notes', (req, res) => {
   // set NOTE ID
   req.body.id = notes.length.toString();

   // validate notes
   if (!validateNote(req.body)) {
      res.status(400).send('The note is not properly formatted!');
   } else {
      const note = createNewNote(req.body, notes);
      res.json(note);
   }
});

// delete request to DELETE NOTE
app.delete('api/notes/:id', (req, res) => {
   const params = req.params.id;
   deleteNote(params, notes);
   res.redirect('');
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
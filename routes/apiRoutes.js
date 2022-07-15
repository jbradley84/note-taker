const router = require("express").Router();
const { notes } = require("../db/db.json");
const { createNewNote, validateNote, deleteNote } = require("../lib/notes");


// get request to RETREIVE NOTES
router.get('/notes', (req, res) => {
   //console.log(notes);
   res.json(notes);
});


// post request to PRINT NOTES to page
router.post('/notes', (req, res) => {
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
router.delete('/notes/:id', (req, res) => {
   const params = req.params.id;
   deleteNote(params, notes);
   res.redirect('');
}); 


module.exports = router;
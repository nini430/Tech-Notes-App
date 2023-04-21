const express=require('express')

const {getAllNotes,createNote,updateNote,deleteNote}=require('../controllers/notesController')

const router=express.Router();

router.route('/').get(getAllNotes).post(createNote);

router.route('/:id').patch(updateNote).delete(deleteNote)

module.exports=router;
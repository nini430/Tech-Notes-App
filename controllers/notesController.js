const asyncHandler=require('express-async-handler');
const Note=require('../models/Note')
const User=require('../models/User')

const DEFAULT_TICKET_NUMBER=500;
//@desc get All Notes
//@route GET /notes
//@access Private

const getAllNotes=asyncHandler(async(req,res)=>{
    const notes=await Note.find().lean();
    if(!notes?.length) {
        return res.status(400).json({message:'Notes not Found!'})
    }

    const notesWithUser=await Promise.all(notes.map(async(note)=>{
        const user=await User.findById(note.user).lean().exec();
        return {...note,username:user.username}
    }))

    return res.status(200).json(notesWithUser);
})

//@desc create new Note
//@route POST /notes
//@access Private

const createNote=asyncHandler(async(req,res)=>{
    let latestTicketNumber;
    const latestNote=await Note.findOne().sort('-ticket');
    if(!latestNote) {
        latestTicketNumber=DEFAULT_TICKET_NUMBER;
    }else{
        latestTicketNumber=latestNote.ticket+1;
    }
    const {title,text,user}=req.body;
    if(!title || !text || !user) {
        return res.status(400).json({message:'All fields are required'})
    }
    const duplicate=await Note.findOne({title});
    if(duplicate) {
        return res.status(409).json({message:'Note with this title already exists'})
    }

    const note=await Note.create({title,text,user,ticket:latestTicketNumber});
    if(note) {
        return res.status(201).json({message:`note with ${note.title} is created`})
    }else{
        return res.status(400).json({message:'Invalid note input'})
    }
})  

//@desc update Note
//@route PATCH /notes/:id
//@access Private


const updateNote=asyncHandler(async(req,res)=>{
    const noteId=req.params.id;

    const {title,text,completed,user,ticket}=req.body;

    if(!title || !text || !user || typeof completed!=='boolean' || !ticket) {
        return res.status(400).json({message:'All Fields required'})
    }

    const note=await Note.findById(noteId);

    if(!note) {
        return res.status(404).json({message:'Note not found'})
    }

    const duplicate=await Note.findOne({title});
    if(duplicate && duplicate._id.toString()!==noteId) {
        return res.status(409).json({message:'Duplicate note title'})
    }

    note.title=title;
    note.text=text;
    note.user=user;
    note.completed=completed;
    
    const updatedNote=await note.save();

    if(updateNote) {
        return res.status(200).json({message:`${updatedNote.title} is updated`})
    }else{
        return res.status(400).json({message:'Invalid note input'})
    }
})

//@desc  delete Note
//@route DELETE /notes/:id
//@access Private

const deleteNote=asyncHandler(async(req,res)=>{
    const noteId=req.params.id;

    const note=await Note.findById(noteId);

    if(!note) {
        return res.status(404).json({message:'Note not found'});
    }

    const result=await note.deleteOne();

    const reply=`note with title ${note.title} is deleted with id ${result._id}`
    return res.status(200).json(reply);
})

module.exports={getAllNotes,createNote,updateNote,deleteNote}
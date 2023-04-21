const mongoose=require('mongoose')


const notesSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    ticket:{
        type:Number,
        required:true
    }
},{timestamps:true})


module.exports=mongoose.model('Note',notesSchema);
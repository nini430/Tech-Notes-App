const bcrypt=require('bcryptjs')
const asyncHandler=require('express-async-handler')

const User=require('../models/User')
const Note=require('../models/Note')


//@desc get All users
//@route GET /users
//@access Private
const getAllUsers=asyncHandler(async(req,res)=>{
        const users=await User.find().select('-password').lean();
        if(!users?.length) {
            return res.status(400).json({message:'Users not found'});
        }

        return res.status(200).json(users);
})

//@desc create user
//@route POST /users
//@access Private
const addUser=asyncHandler(async(req,res)=>{
        const {username,password,roles}=req.body;
        if(!username || !password || !Array.isArray(roles) || !roles.length) {
            return res.status(400).json({message:'All Fields required'})
        }
        const duplicate=await User.findOne({username});
        if(duplicate) {
            return res.status(409).json({message:'User already exists'})
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const userObject={
            username,
            password:hashedPassword,
            roles
        }

        const user=await User.create(userObject);

        if(user) {
            return res.status(201).json({message:`user with username ${user.username} is created`})
        }else{
            return res.status(400).json({message:'Invalid user input'})
        }

})
//@desc update user
//@route PATCH /users/:id
//@access Private
const updateUser=asyncHandler(async(req,res)=>{
    const userId=req.params.id;
    const {username,password,roles,active}=req.body;
    if(!username || !Array.isArray(roles) || !roles.length || typeof active!=='boolean') {
        return res.status(400).json({message:'All fields required'})
    }
    const user=await User.findById(userId);
    if(!user) {
        return res.status(404).json({message:'User not found'})
    }
    const duplicate=await User.findOne({username}).lean().exec();
    if(duplicate && duplicate._id.toString()!==userId) {
        return res.status(409).json({message:'Duplicate username'})
    }
    user.username=username;
    user.roles=roles;
    user.active=active;
    if(password) {
        const hashedPassword=await bcrypt.hash(password,10);
        user.password=hashedPassword;
    }

    const updatedUser=await user.save();

    if(updateUser) {
        return res.status(200).json({message:`User  with username ${updatedUser.username} is updated`})
    }else{
        return res.status(400).json({message:'username didnot update'})
    }

})

//@desc delete user
//@route DELETE /users/:id
//@access Private

const deleteUser=asyncHandler(async(req,res)=>{
    const userId=req.params.id;

    const user=await User.findById(userId);

    if(!user) {
        return res.status(404).json({message:'User not found'})
    }

    const note=await Note.findOne({user:userId})

    if(note) {
        return res.status(400).json({message:'user has assigned notes'})
    }

    const result=await user.deleteOne();

    const reply=`${result.username} is deleted with id ${result._id}`

    return res.status(200).json(reply);
})


module.exports={getAllUsers,addUser,updateUser,deleteUser};



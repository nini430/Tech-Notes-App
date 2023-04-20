require('dotenv').config();
const path=require('path')

const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require('cors');
const mongoose=require('mongoose')

const corsOptions=require('./config/corsOptions')
const {logger,logEvent}=require('./middleware/logger')
const errorHandler=require('./middleware/errorHandler')
const connectDB=require('./config/dbConn')


const app=express();

connectDB();

app.use(logger);
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use('/',express.static(path.join(__dirname,'public')))

app.use('/',require('./routes/root'));
app.use('/users',require('./routes/userRoutes'));

app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')) {
        res.json({message:'Resource not found'})
    }else{
        res.type('txt').send('Not Found')
    }
})

const PORT=process.env.PORT || 3500;

app.use(errorHandler);

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready')
    app.listen(PORT,()=>console.log(`Server running at port ${PORT}`))
})

mongoose.connection.on('error',(err)=>{
    console.log(err);
    const message=`${err.no}- ${err.code}\t${err.syscall}\t${err.hostname}`;
    logEvent(message,'mongoError.log');
})

const path=require('path')

const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require('cors');

const corsOptions=require('./config/corsOptions')
const {logger}=require('./middleware/logger')
const errorHandler=require('./middleware/errorHandler')

const app=express();

app.use(logger);
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use('/',express.static(path.join(__dirname,'public')))

app.use('/',require('./routes/root'));

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
app.listen(PORT,()=>console.log(`Server running at port ${PORT}`))
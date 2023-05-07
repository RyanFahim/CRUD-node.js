const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')



const todoHandler = require('./routes/todohandler')

//express app initializaion
const app = express();
app.use(express.json());
app.use(bodyParser.json());


//connection with database
mongoose.connect("mongodb://localhost:27017/todos",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("Database connection successful")
})
.catch((err)=>{
    console.log(err)
})

//routes
app.use('/todo',todoHandler)

//deafault error handler
function errorHandler(err, req, res, next){
    if(res.headerSent){
        return next(err);
    }
    res.staus(500).json({error: err})
}

app.listen(3000, ()=>{
    console.log("App is listening on port 3000")
})
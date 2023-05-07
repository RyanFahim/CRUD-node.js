const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Todo = require('../schemas/todoSchema');

const pdfkit = require('pdfkit');
const xlsx = require('xlsx');
const fs = require('fs');



//Get all the todos
router.get('/', async (req, res) => {
    Todo.find({})
    .then((response)=> {
        res.json({
            response
        })
    })
    .catch((error)=>res.send(error))

});

//Get a the todo by ID
router.get('/find', async (req, res) => {
    let todoID = await req.body.todoID

    Todo.findById(todoID)
    .then((response)=>{
        res.json({
            response
        })
    })
    .catch((error)=> res.send(error))
});

//Post a the todo
router.post('/', async(req, res) => {

   try{
    const newTodo = await new Todo(req.body)
    // console.log(req.body)
    newTodo.save()
    res.send(newTodo)
   }catch(error){
    res.send(error)
   }



});

//Post multiple the todo
router.post('/all', async (req, res) => {

    try{
        const insertedTodos = await Todo.insertMany(req.body)
        console.log(req.body)
        res.status(200).json(insertedTodos);
    }catch(error){
        res.send(error)
    }
});


//Update a todo
router.post('/update',async (req, res) => {

    let todoID = req.body.todoID
    
    
    const updateTodo = await Todo.findByIdAndUpdate(todoID,{
        $set:{
            title: req.body.title,
            description: req.body.description,
            status:req.body.status
        }
    })
    .then(()=>{

        // res.send(updateTodos)
        res.json({
            message: 'Updated successfully'
        })
    })
    .catch(error=>{ 
        // res.send(error)
        res.json({
            message: 'An error occured'
        })
    })
});


//Delete a the todo
router.delete('/', async (req, res) => {
    let deleteTodo = req.body.todoID

    Todo.findOneAndDelete({"_id": deleteTodo})
    .then(()=> {
        res.json({
            message: 'Delete successful'
        })
    })
    .catch((error)=>{
        res.json({
            message: 'An error occured'
        })
    })

});

//Pdf download for todos
router.get('/download/pdf', async (req, res) => {
    try {
        const todos = await Todo.find({});
    
        const pdfDoc = new pdfkit();
        pdfDoc.pipe(fs.createWriteStream('files/todos.pdf')); // Save PDF inside 'downloads' directory
    
        todos.forEach((todo) => {
          pdfDoc.text(`Title: ${todo.title}`);
          pdfDoc.text(`Description: ${todo.description}`);
          pdfDoc.moveDown();
        });
    
        pdfDoc.end();
    
        const filePath = path.join(__dirname, 'files', 'todos.pdf');
        res.download(filePath, 'todos.pdf');
      } catch (error) { res.send(error)
        // res.status(500).json({ message: 'An error occurred while retrieving todos.' });
      }
  });

module.exports = router;


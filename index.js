// const{MongoClient}=require('mongodb');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT||3000;

const expenseDB = require('./expense');
mongoose.connect('mongodb+srv://expensetracker:Madan2003@cluster0.rlsvl76.mongodb.net/newDb?retryWrites=true&w=majority');

app.get('/expense',async (req, res) =>{
    console.log(req.url);
    const resultsCurrent = await expenseDB.find();
    //res.send("<h1>Hello World</h1>");
    res.send(resultsCurrent.toString());
})

app.get('/expense/:id', async (req, res) => {
    console.log(req.body);
    try {
        const idFromUser = req.params.id;
        const resultsCurrent = await expenseDB.findById(idFromUser);
        //const resultsCurrent = await expenseDB.findByIdAndDelete(idFromUser);
        if(resultsCurrent){
            console.log(resultsCurrent);
            //res.send(`The data deleted is: ${ resultsCurrent } `);
            //res.send(`The data fetched is: ${ resultsCurrent.title } `);
            res.send(`The data deleted is: ${ resultsCurrent.toString() } `);
        }
        else{
            res.send("<h1>Invalid Id</h1>");
        }    
    }
    catch(err) {
        console.log(err);
        res.send(err);
    }
})

app.put('/expense',(req, res) =>{
    console.log(req.body);
    res.send("<h1>Hai World</h1>");
})


//Allowing JSON from request
//In default all the body format is restricted

app.use(express.json());

app.post('/expense', async (req, res) => {
    console.log(req.body);
    const newData = req.body;
    try {
        if(newData && (newData.title != undefined)){
            const statusInserted = await expenseDB.create(newData);
            res.send(`Inserted Sucessfully of title ${ req.body.title }`);
            console.log(statusInserted);
        }
        else{
            res.send("Empty/Undefined data recieved");
            console.log("Empty Data");
        }
        
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
})

//Update using full fledged options

app.post('/expense/updateFF/:id/:change', async (req, res) => {
    console.log(req.params.id);
    const updateId = req.params.id;
    const updateAmount = req.params.change;
    try {
        if(updateId){
            const docRet = await expenseDB.findById(updateId);
            docRet.amount = updateAmount;
            await docRet.save();
            res.send("Updated sucessfully");
        }
        else{
            res.send("Empty Data recieved");
        }
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
})


//Update using findOneAndUpdate 

app.put('/expense/updateFunction/:id/:change', async (req, res) => {
    console.log(req.params.id);
    const updateId = req.params.id;
    const updateAmount = req.params.change;
    try {
        if(updateId){
            console.log(updateAmount);
            const updateStatus = await expenseDB.findByIdAndUpdate(updateId, { $set: {amount: updateAmount}});
            res.send("Updated sucessfully");
            console.log(updateStatus);
        }
        else{
            res.send("Empty Data recieved");
        }
    }
    catch(err){
        console.log("Error spotted:");
        console.log(err);
        res.send(err);
    }
})

app.listen(port, () => {
    console.log( `Example app listening on port ${port} `);
})

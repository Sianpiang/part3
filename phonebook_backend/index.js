import morgan from 'morgan';
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import Person from './models/mongo.js';

const app = express();
app.use(express.json())
dotenv.config()
app.use(cors())
app.use(express.static('build'))
morgan.token('body', function(req, res) {
return JSON.stringify(req.body);
});
app.use(morgan(':method :status :res[content-length] -:response-time ms :body'))


app.get('/',(req,res)=>{
    res.send('<h2>Welcome Everyone</h2>')
})

app.get('/api/persons',(req,res)=>{
   Person.find({}).then(persons=>{
    res.json(persons)
   })
})

app.get('/api/persons/:id',(req,res,next)=>{
   Person.findById(req.params.id).then(person=>{
    if(person){
        res.json(person)
    }
    else{
        res.status(404).end()
    }
   })
   .catch(error=>{
        next(error);
   })
})

app.get('/info',async(req,res)=>{
    const time = new Date();
    const len = await Person.countDocuments({})     
    console.log(len);
    res.send(`<p>Phonebook has info for ${len} people <br/> ${time.toString()}</p>`);
})

app.delete('/api/persons/:id',(req,res,next)=>{
    Person.findByIdAndRemove(req.params.id).then(result=>{
        res.status(204).send({message:"Item deleted"})
    })
    .catch(error=>{
        next(error)
    })
})

app.post('/api/persons',(req,res,next)=>{
    const body = req.body;
    const newPerson = new Person({
        name:body.name,
        number:body.number,
    })
    newPerson.save().then(savedPerson=>{
        res.json(savedPerson)
    })
    .catch(error=>next(error))
})

app.put('/api/persons/:name',(req,res,next)=>{
    const name = req.body.name
    const newNumber = req.body.number
    Person.findOneAndUpdate({name},{number:newNumber},{new:true}).then(result=>{
        res.status(200).json(result)
    })
    .catch(error=>next(error))
})

const unknownEndpoint=(req,res)=>{
    res.status(404).send(({error:'unknown endpoint'}))
}
app.use(unknownEndpoint)
const errorHandler = (error,req,res,next)=>{
    console.log(error.name);
    if(error.name==='CastError'){
        return res.status(400).send({error:'malformated id'})
    }
    if(error.name==='ValidationError'){
        return res.status(400).send({error:error.message})
    }
}

app.use(errorHandler);


const PORT = process.env.PORT || 6001;
mongoose.connect( process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server connected to ${PORT}`);
    })
})
.catch((error)=>console.log(`${error} did not connect`))


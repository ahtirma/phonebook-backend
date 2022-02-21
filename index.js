require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

app.use(cors());
app.use(express.static('build'));

morgan.token('body', function(req, res ) {
    return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for  ${persons.length}  people </p> <p>  ${new Date().toString()} </p>`);
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    }) 
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    });
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

const getRandomId = () => {
    const min = 1;
    const max = 50000;
    return Math.floor(Math.random() * (max - min) + min);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if(!body.name || !body.number) {
        return response
                .status(400)
                .json({
                    error: 'name or number is missing',
                })
    }

    const foundName = persons.find(person => person.name === body.name);
    if(foundName) {
        return response
                .status(400)
                .json({
                    error: 'name must be unique',
                });
    }

    let id = getRandomId();
    let foundId = persons.find(person => person.id === id)
    
    while(foundId) {
        id = getRandomId();
        foundId = persons.find(person => person.id === id)
    }

    const person = {
        id: id,
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person);
    response.json(person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});


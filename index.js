const express = require('express');
const app = express();

app.use(express.json());

let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
];

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for  ${persons.length}  people </p> <p>  ${new Date().toString()} </p>`);
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if(person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
    
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
    let id = getRandomId();
    let found = persons.find(person => person.id === id)
    
    while(found) {
        id = getRandomId();
        found = persons.find(person => person.id === id)
    }
    
    const person = {
        id: id,
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person);
    response.json(person);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});


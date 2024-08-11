const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const app = express();
app.use(express.json());
let logger = morgan('tiny');
app.use(cors());
app.use(express.static('dist'))

//  Creating routes now
// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>');
// });
app.get('/info', (request, response) => {
  const dateAndTime = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people </p> 
    <p>${dateAndTime}</p>  
    `);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person);
    })
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id).then(note=>{
    if (note) {
      res.json(note);
      } else {
        res.status(404).send({ error: 'not found' });
        }

  })
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);
  if (person) {
    persons = persons.filter(person => person.id !== id);
    res.status(200).json(persons);
  } else {
    res.status(404).send({ error: 'not found' });
  }
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
    }
  const person = new Person({
    name: body.name,
    number: body.number
    });
  person.save().then(savedPerson => {
    res.json(savedPerson);
    })
})


const express = require('express');

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
PORT = 3001;

//  Creating routes now
app.get('/info', (request, response) => {
  const dateAndTime = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people </p> 
    <p>${dateAndTime}</p>  
    `);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'not found' });
  }
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

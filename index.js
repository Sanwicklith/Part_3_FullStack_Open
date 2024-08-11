const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');

const app = express();

// Use environment variable for port or default to 3001
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('dist'));

// MongoDB connection
const url = process.env.MONGODB_URI || 'your_mongodb_connection_string';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error.message));

// Define routes
app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const dateAndTime = new Date();
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${dateAndTime}</p>
    `);
  });
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ID format' });
  }

  Person.findById(id).then(person => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).send({ error: 'Not found' });
    }
  }).catch(error => {
    res.status(500).send({ error: 'Something went wrong' });
  });
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
  }).catch(error => {
    res.status(500).json({ error: 'Something went wrong' });
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ID format' });
  }

  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).send({ error: 'Not found' });
      }
    })
    .catch(error => {
      console.error('Error deleting person:', error.message);
      res.status(500).send({ error: 'Something went wrong' });
    });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

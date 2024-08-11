const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('dist'));

// MongoDB connection
const url = process.env.MONGODB_URI || 'your_mongodb_connection_string';
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
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

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(error => next(error)); // Pass the error to the error handler
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ID format' });
  }

  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: 'Not found' });
      }
    })
    .catch(error => next(error)); // Pass the error to the error handler
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error)); // Pass the error to the error handler
});

// PUT route to update an existing person's number
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;

  // Ensure the request body contains the necessary data
  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  // Construct the updated person object
  const updatedPerson = { number };

  // Use findByIdAndUpdate to update the existing entry
  Person.findByIdAndUpdate(
    id,
    updatedPerson,
    { new: true, runValidators: true, context: 'query' } // Options: return the updated object and run validation
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(error => next(error)); // Pass the error to the error handler middleware
});


app.delete('/api/persons/:id', (req, res, next) => {
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
    .catch(error => next(error));
});

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Invalid ID format' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);  
};

// Use error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

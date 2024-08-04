const express = require('express')

const persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const app = express()
PORT = 3001

//  Creating routes now
app.get('/', (request, response) => {
  response.send('<h1>Hello Part_3!</h1>')

})

app.get('/api/persons', (req, res)=>{
  res.json(persons)
})

app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)})
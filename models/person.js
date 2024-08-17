const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);


const url = process.env.MONGODB_URI;


console.log('connecting to', url);

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB', result.connection);
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        // Ensure length is 8 or more and follows the correct format
        return /^\d{2,3}-\d{4,}$/.test(v) && v.length >= 8;
      },
      message: props => `${props.value} is not a valid phone number! Must be in the format: XX-XXXX or XXX-XXXX, and at least 8 characters long.`
    },
    required: true,
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});


module.exports = mongoose.model('Person', personSchema);
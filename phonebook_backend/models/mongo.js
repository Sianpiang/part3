import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
    name:{
      type: String,
      minLength:3,
      required:true
    },
    number:{
      type: String,
      validate: {
        validator: function(v) {
          return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [true, 'User phone number required']
    },
}
,{timestamps:true})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
const Person = mongoose.model('Person',personSchema);

export default Person;


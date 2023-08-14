import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
    name:String,
    number:Number,
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


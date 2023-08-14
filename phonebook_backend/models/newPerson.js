import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
    name:String,
    number:Number,
}
,{timestamps:true})

const Person = mongoose.model('Person',personSchema);

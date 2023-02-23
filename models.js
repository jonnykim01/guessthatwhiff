import mongoose from 'mongoose';

let models = {}

// connect to MongoDB
console.log('connecting to mongoDB')
// TODO: insert connection string
await mongoose.connect('insert connection string');
console.log('successfully connected to mongoDB')

// create schemas
const postSchema = new mongoose.Schema({
    url: String,
    rank: String,
    created_date: Date
})

//create model from schema
models.Post = mongoose.model('Post', postSchema)

console.log('mongoose models created')

export default models
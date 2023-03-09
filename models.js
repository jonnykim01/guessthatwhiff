import mongoose from 'mongoose';

let models = {};

// connect to MongoDB
console.log('connecting to mongoDB');
await mongoose.connect('mongodb+srv://Ryan1598:LxWpQVKWqABYZyaP@cluster0.l8h50sm.mongodb.net/guess-that-whiff?retryWrites=true&w=majority');
console.log('successfully connected to mongoDB');

// create schemas
const postSchema = new mongoose.Schema({
    url: String,
    rank: String,
    created_date: Date
},{
    collection: ''
});

//create model from schema
models.Post = mongoose.model('Post', postSchema);

const userSchema = new mongoose.Schema({
    username: String,
    saved_videos: [postSchema],
    current_streak: Number,
    longest_streak: Number,
    seen_videos: [String]
}, {
    collection: ''
});

models.User = mongoose.model('User', userSchema);

console.log('mongoose models created');

export default models;
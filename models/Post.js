const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    userPost:{
        type: String,
        required: true
    },
    feed:{
        type: String,
        required: true
    },
    img:{
        type: String,
        required: false
    },
    likes:{
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('posts', Post)
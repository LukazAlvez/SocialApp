const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    userName:{
        type: String,
        required: true
    },
    post:{
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
    datePost:{
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('posts', Post)
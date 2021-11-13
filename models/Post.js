const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
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
    coments:{
        user: {type: String},
        coment: {type: String},
        idComent: {type: String}
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
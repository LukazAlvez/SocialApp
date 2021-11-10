const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        require: true
    },
    coments:{
        type: String,
        required: true
    },

});

mongoose.model('coments', Coment)
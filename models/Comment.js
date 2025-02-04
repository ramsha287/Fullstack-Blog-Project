const mongoose = require('mongoose');

//schema
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    post : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
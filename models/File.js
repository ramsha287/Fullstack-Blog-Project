const mongoose = require('mongoose');

//schema
const fileSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    public_id : {
        type: String,
        required: true,
    },
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{
    timestamps: true
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
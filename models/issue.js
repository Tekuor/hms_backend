const mongoose = require('mongoose');

var issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title can\'t be empty'
    },
    description: {
        type: String,
        required: 'Description can\'t be empty'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: String,
        required: 'User Id can\'t be empty'
    },
    name: {
        type: String,
        required: 'Name can\'t be empty'
    },
    status: {
        type: String,
        required: 'Status can\'t be empty'
    },
});

const Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue 
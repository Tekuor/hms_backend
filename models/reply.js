const mongoose = require('mongoose');

var replySchema = new mongoose.Schema({
    description: {
        type: String,
        required: 'Description can\'t be empty'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    issue_id: {
        type: String,
        required: 'Issue Id can\'t be empty'
    },
    commenter: {
        type: String,
        required: 'Commenter can\'t be empty'
    },
});

const Reply = mongoose.model('Reply', replySchema);
module.exports =  Reply 
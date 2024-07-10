const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    created: {
        type: Date,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
})

const ThreadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    lastModified: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    messages: {
        type: [MessageSchema],
        required: true,
        default: [],
    },
});

const Thread = mongoose.model('Thread', ThreadSchema);

module.exports = Thread;
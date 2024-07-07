const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    wasSentByUser: {
        type: Boolean,
        required: true,
    },
})

const ChatSchema = new mongoose.Schema({
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

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    expDate: {
        type: Date,
        required: true,
    },
});

const Verification = mongoose.model('Verification', VerificationSchema);

module.exports = Verification;
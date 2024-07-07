const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 5;

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
});

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password'))
        return next();

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    await bcrypt.hash(this.password, salt)
        .then((password) => {
            this.password = password;
            next()
        })
        .catch((error) => next(error));
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
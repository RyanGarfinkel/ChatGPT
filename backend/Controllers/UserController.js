const User = require('../Models/User');
const Verification = require('../Models/Verification');
const emailCode = require('../Utils/EmailProvider');

const genVerificationCode = () => {
    return Math.floor(Math.random() * 900000 + 100000)
        .toString()
        .padStart(6, '0');
}

const sendVerification = async (req, res) => {
    const user = req.user;
    const code = genVerificationCode();

    let verification = await Verification.findOneAndUpdate({ userId: user._id }, {
        code: code,
        expDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    })
        .catch(() => null);

    if(verification)
        return res.status(204).json();

    verification = Verification.create({
        userId: user._id,
        code: code,
        expDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    })
        .catch(() => null);
        
    if(!verification)
        return res.status(500).json({ error: 'Could not generate verification code.' });

    await emailCode(user, code)
        .then(() => res.status(204).json())
        .catch(() => res.status(500).json({ error: 'Could not send email.' }));
}

const verifyCode = async (req, res) => {
    const user = req.user;
    const { code } = req.body;

    let verification = await Verification.findOne({ userId: user._id })
        .catch(() => null);

    if(!verification)
        return res.status(400).json({ error: 'User does not have any verifications.' });

    if(verification.code !== code)
        return res.status(400).json({ error: 'Code is invalid.' });

    
    const wasUserUpdated = await User.findByIdAndUpdate(user._id, {
        isVerified: true
    })
        .catch(() => null);

    if(!wasUserUpdated)
        return res.status(500).json({ error: 'Could not update user status.' });

    await Verification.findByIdAndDelete(verification._id)
        .then(() => res.status(204).json())
        .catch(() => res.status(500).json({ error: 'Could not delete verification entry.' }));
}

module.exports = { sendVerification, verifyCode };
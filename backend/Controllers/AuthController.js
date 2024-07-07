const User = require('../Models/User');
const authProvider = require('../Utils/AuthProvider');
const bcrypt = require('bcrypt');

const clientUserObj = (user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isVerified: user.isVerified,
});

const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    })
        .then((user) => {
            const accessToken = authProvider.genAccessToken(user.email);
            const refreshToken = authProvider.genRefreshToken(user.email);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ accessToken: accessToken, user: clientUserObj(user) });
        }).catch((error) => {
    
            if(error.code && error.code === 11000)
                return res.status(400).json({ error: 'Email is already in use.' });

            res.status(500).json({ error: 'Could not create user.' });
        });
}

const login = async (req, res) => {
    const { email, password } = req.body;

    await User.findOne({ email: email })
        .then(async (user) => {
            const passwordMatches = await bcrypt.compare(password, user.password);

            if(!passwordMatches)
                return res.status(401).json({ error: 'Password does not match.' });

            const accessToken = authProvider.genAccessToken(user.email);
            const refreshToken = authProvider.genRefreshToken(user.email);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ accessToken: accessToken, user: clientUserObj(user) });
        })
        .catch(() => res.status(404).json({ error: 'Email not found.' }))
}

const refreshAccesToken = (req, res) => {
    const { refreshToken } = req.body;

    const email = authProvider.verifyRefreshToken(refreshToken);

    if(email.error)
        return res.status(401).json({ error: email.error });

    res.status(200).json({ accessToken: authProvider.genAccessToken(email.email) });
}

module.exports = { signup, login, refreshAccesToken };
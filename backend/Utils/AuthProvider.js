const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const genAccessToken = (email) => {
    return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h',
    });
}

const genRefreshToken = (email) => {
    return jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1d',
    });
}

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headerr.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token)
        return res.status(401).json({ error: 'Missing access token.' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if(err)
            return res.status(403).json({ error: 'Invalid access token.' });

        const email = payload.email;
        const user = await User.findOne({ email: email })
            .catch(() => null);

        if(!user)
            return res.status(403).json({ error: 'Access token contains invalid data.' });

        req.user = user;

        next();
    })
}

const verifyRefreshToken = (refreshToken) => {
    
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {

        if(err)
            return { error: 'Refresh token is invalid.' };

        const user = User.findOne({ email: payload.email })
            .catch(() => null);

        if(!user)
            return { error: 'Refresh token contains invalid user.' };

        return { email: payload.email };
    })
}

module.exports = { genAccessToken, genRefreshToken, verifyAccessToken, verifyRefreshToken };
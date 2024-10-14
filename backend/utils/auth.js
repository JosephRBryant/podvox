const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Show } = require('../db/models');

const { secret, expiresIn } = jwtConfig;


// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

const restoreUser = async (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    if (!token) return next();

    return jwt.verify(token, secret, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;

            const user  = await User.findByPk(id, {
                include: [{
                    model: Show,
                    attributes: ['id']
                }],
                attributes: ['id', 'email', 'createdAt', 'updatedAt', 'profileImg', 'firstName', 'lastName', 'username']
            });

            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    profileImg: user.profileImg,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    showId: user.Show ? user.Show.id : null
                }
            }
        } catch (e) {
            console.error('Error fetching user: ', e)
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

module.exports = { setTokenCookie, restoreUser, requireAuth };

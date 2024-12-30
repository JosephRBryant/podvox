const router = require('express').Router();
const { restoreUser, requireAuth, setTokenCookie } = require('../../utils/auth.js');
const { User, Show } = require('../../db/models');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const showsRouter = require('./shows.js');
const episodesRouter = require('./episode.js');


//You can use requireAuth as middleware for routes that require sign in
//You can use setTokenCookie as a func to set cookie for user

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/shows', showsRouter);
router.use('/episodes', episodesRouter);


// Restore user
router.get('/restore-user', (req, res) => {
    return res.json(req.user);
});



module.exports = router;

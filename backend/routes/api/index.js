const router = require('express').Router();
const { restoreUser, requireAuth, setTokenCookie } = require('../../utils/auth.js');
const { User, Show } = require('../../db/models');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const showsRouter = require('./shows.js');


//You can use requireAuth as middleware for routes that require sign in
//You can use setTokenCookie as a func to set cookie for user

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/shows', showsRouter);


// Restore user
router.get('/restore-user', (req, res) => {
    console.log('req user in restuse', req.user)
    return res.json(req.user);
});



module.exports = router;

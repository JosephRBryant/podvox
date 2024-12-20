const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Show } = require('../../db/models');
const { singleMulterUpload, singlePublicFileUpload } = require('../../awsS3')

const router = express.Router();

//backend validation for signup
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {

    const { email, password, username, firstName, lastName } = req.body;

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, firstName, lastName, hashedPassword });

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

// Update with user info
router.put('/:id/update-user', requireAuth, handleValidationErrors, async (req, res, next) => {
    try {
        let { user } = req;
        let userId = req.params.id;
        const { email, username, firstName, lastName, password } = req.body;

        let userExists = await User.findByPk(userId);
        if (!userExists) {
            return res.status(404).json({message: "User couldn't be found"})
        } else if (userExists.id !== parseInt(userId)) {
            return res.status(404).json({message: "User does not own this account"})
        }

        let updatedFields = { email, username, firstName, lastName };
        if (password) {
            const hashedPassword = bcrypt.hashSync(password);
            updatedFields.password = hashedPassword;
        }

        userExists.set(updatedFields);
        await userExists.save();
        const updatedUser = userExists.toJSON();
        return res.json(updatedUser);
    } catch(error) {
        next(error);
    }
})

// Update user with image
router.put('/:id/update-image', singleMulterUpload('image'), requireAuth, handleValidationErrors, async (req, res, next) => {
    try{
        const { userId, username, email, firstName, lastName } = req.body;
        let user;
        console.log('destructured user from route-----------------', userId, username, firstName, lastName, '---------------------------------------')
        if(userId){
            user = await User.findByPk(userId);
        } else{
            throw new Error("No user found with that id")
        }

        let imgUrl;

        if(req.file){
            imgUrl = await singlePublicFileUpload(req.file); //converts data from form
            user.profileImg = imgUrl;
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        await user.save();
        return res.json(user);

    }catch(e){
        next(e)
    }

})

// Get current user
router.get ('/current', requireAuth, handleValidationErrors, async (req, res) => {
    try {
        const { user } = req;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImg: user.profileImg,
            showId: user.showId
        };
        return res.json(safeUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error'});
    }
})

// Restore session user
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImg: user.profileImg,
            showId: user.showId
        };

        return res.json(safeUser
        );
    } else return res.json({ user: null });
});

// // Get User Shows

// router.get('/:userId/shows', async (req, res, next) => {
//     try {
//       const { user } = req;
//       let user_id = parseInt(req.params.userId);

//       let userShow = await Show.findOne({
//         where: {
//           userId: user_id
//         }
//       });
//       let userShows = await Show.findAll();


//     //   console.log('usershows----------', userShows)
//       console.log('usershow----------', userShow)
//     //   console.log('user----------', user)
//       if (!userShow) {
//         return res.status(404).json({ message: 'Show not found for this user'})
//       }
//       userShow.dataValues.showLink = 'www.example.com'
//       res.json(userShow)

//     } catch(error) {
//       error.message = "Bad Request";
//       error.status = 400;
//       next(error)
//     }
//   })


module.exports = router;

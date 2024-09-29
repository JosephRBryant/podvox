const express = require('express');
const { check } = require('express-validator');
const { Show, User, Episode, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all Shows
router.get('/', async (req, res, next) => {
  try {
    let shows = await Show.findAll();
    res.json(shows)
  } catch(error) {
    next(error)
  }
})

// Get one Show by Id
router.get('/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    let show = await Show.findOne({
      where: { id: id},
      include: [
        { model: User,
          attributes: ['username', 'profileImg']
        },
        { model: Episode,
          attributes: ['id', 'episodeTitle', 'episodeDesc', 'pubDate', 'duration', 'episodeImage', 'downloads']
        }
      ]
    });

    if (!show) {
      return res.status(404).json({ message: "Show couldn't be found"})
    };
    return res.json(show)
  } catch(error) {
    next(error)
  }
})

// Create a Show
router.post('/', requireAuth, handleValidationErrors, async (req, res, next) => {
  try {
    const { user } = req;
    if (user) {
      const { showTitle, showSubtitle, showDesc, author, showLink, category, showImage, language, explicit } = req.body;
      let show = await Show.create({ userId: user.id, showTitle, showSubtitle, showDesc, author, showLink, category, showImage, language, explicit });

      show = show.toJSON();
      res.status(201);
      return res.json(show);
    } else {
    res.status(400).json({message: 'You must be logged in to create a show!'})
    }
  } catch(error) {
    error.message = "Bad Request";
    error.status = 400;
    next(error)
  }
})

// Update a Show
router.put('/:id', requireAuth, handleValidationErrors, async (req, res, next) => {
  try {
    const { user } = req;
    if (user) {
      const { showTitle, showSubtitle, showDesc, author, showLink, category, showImage, language, explicit } = req.body;
      let id = req.params.id;
      let show = await Show.findByPk(id);
      if (!show) {
        return res.status(404).json({ message: "Show couldn't be found"})
      } else if (show.userId !== user.id) {
        return res.status(404).json({ message: "User must own show to make changes"})
      } else {
        show.set({
          showTitle, showSubtitle, showDesc, author, showLink, category, showImage, language, explicit
        })
        await show.save();
        show = show.toJSON();
        return res.json(show);
      }
    }
  } catch(error) {
    next(error)
  }
});

// Delete a Show
router.delete('/:id', requireAuth, handleValidationErrors, async (req, res, next) => {
  try {
    let { user } = req;
    let id = req.params.id;

    let show = await Show.findByPk(id);
    if (!show) {
      res.status(404).json({ message: "Show couldn't be found"})
    } else if (show.userId !== user.id) {
      return res.status(404).json({ message: "User must own show to delete"})
    } else {
      await show.destroy();
      return res.json({ message: "Successfully deleted"})
    }
  } catch(error) {
    next(error)
  }
})

module.exports = router;

const express = require('express');
const { check } = require('express-validator');
const { Show, User, Episode, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { singleMulterUpload, singlePublicFileUpload, multipleMulterUpload, multiplePublicFileUpload } = require('../../awsS3');

const router = express.Router();

// Get all Shows
router.get('/', async (_req, res, next) => {
  try {
    let shows = await Show.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'profileImg']
        },
        {
          model: Episode,
          attributes: ['id', 'downloads']
        }
      ]
    });

    let showsWithDownloads = await Promise.all(shows.map(async show => {
      let totalDownloads = await Episode.sum('downloads', { where: { showId: show.id}});

      return {
        ...show.toJSON(),
        showDownloadTotal: totalDownloads || 0
      };
    }));

    res.json(showsWithDownloads)
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
          attributes: ['id', 'episodeTitle', 'episodeDesc', 'guestInfo', 'pubDate', 'duration', 'episodeUrl', 'episodeImage', 'downloads']
        }
      ]
    });

    if (!show) {
      return res.status(404).json({ message: "Show couldn't be found"})
    };

    let showDowloadTotal = await Episode.sum('downloads', { where: { showId: id }});

    let response = {
      ...show.toJSON(),
      showDowloadTotal
    }

    return res.json(response)
  } catch(error) {
    next(error)
  }
})


// Create a Show
router.post('/', singleMulterUpload('image'), requireAuth, handleValidationErrors, async (req, res, next) => {
  try {
    const { user } = req;

    if (user) {
      const {
        showTitle,
        showSubtitle,
        showDesc,
        author,
        category,
        language,
        explicit
      } = req.body;

      let imgUrl;

      if (req.file) {
        imgUrl = await singlePublicFileUpload(req.file);
      }

      const show = await Show.create({
        userId: user.id,
        showTitle,
        showSubtitle,
        showDesc,
        author,
        category,
        showImage: imgUrl,
        language,
        explicit
      });

      const dbUser = await User.findByPk(user.id);
      if (dbUser) {
        dbUser.showId = show.id;
        await dbUser.save();
      }

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
router.put('/:id/update-show', requireAuth, handleValidationErrors, async (req, res, next) => {
  try {
    const { user } = req;
    let userId = req.params.id;
    const {
      showTitle,
      showSubtitle,
      showDesc,
      author,
      showLink,
      category,
      language,
      explicit
    } = req.body;
    let id = req.params.id;
    let show = await Show.findByPk(id);

    let updatedFields = { showTitle, showSubtitle, showDesc, author, showLink, category, category, language, explicit };

    await show.set(updatedFields);
    await show.save();
    const updatedShow = show.toJSON();
    return res.json(updatedShow);
  } catch(error) {
    next(error)
  }
});

// Update show with image
router.put('/:id/update-image', singleMulterUpload('image'), requireAuth, handleValidationErrors, async (req, res, next) => {
  try {
    const { showId, showTitle, showSubtitle, showDesc, author, showLink, category, language, explicit } = req.body;
    let show;
    if (showId) {
      show = await Show.findByPk(showId)
    } else {
      throw new Error("No show found with that id")
    }

    let imgUrl;

    if(req.file) {
      imgUrl = await singlePublicFileUpload(req.file);
      show.showImage = imgUrl;
    }

    if (showTitle) show.showTitle = showTitle;
    if (showSubtitle) show.showSubtitle = showSubtitle;
    if (showDesc) show.showDesc = showDesc;
    if (author) show.author = author;
    if (showLink) show.showLink = showLink;
    if (category) show.category = category;
    if (language) show.language = language;
    if (explicit) show.explicit = explicit;

    await show.save();
    const updatedShow = show.toJSON();
    return res.status(200).json(updatedShow);

  } catch(e) {
    next(e)
  }
})

// Delete a Show
router.delete('/:showId', requireAuth, handleValidationErrors, async (req, res, next) => {
  try {
    let { user } = req;
    let { showId } = req.params;
    let show = await Show.findByPk(showId);

    if (!show) {
      res.status(404).json({ message: "Show couldn't be found"})
    } else if (show.userId !== user.id) {
      return res.status(404).json({ message: "User must own show to delete"})
    } else {
      await show.destroy();
      return res.json({ showId })
    }
  } catch(error) {
    next(error)
  }
})

// Create an Episode
router.post('/:id/episodes', multipleMulterUpload(['img_url', 'audio_url']), requireAuth, handleValidationErrors, async (req, res, next) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: 'You must be logged in to create an Episode.' })
    }
    const {
      // userId,
      // showId,
      episodeTitle,
      episodeDesc,
      guestInfo,
      duration,
      size,
      tags,
      explicit,
      published,
      downloads
    } = req.body;

    const { id: showId } = req.params;

    let imgUrl = null;
    let episodeUrl = null;


    if (req.files && req.files.img_url) {
      const imgUrls = await multiplePublicFileUpload(req.files.img_url);
      imgUrl = imgUrls.length > 0 ? imgUrls[0] : null;
    }

    if (req.files && req.files.audio_url) {
      const audioUrls = await multiplePublicFileUpload(req.files.audio_url);
      episodeUrl = audioUrls.length > 0 ? audioUrls[0] : null;
    }

    const maxEp = await Episode.max('episodeNumber', {
      where: {showId}
    })

    const newEpisodeNumber = maxEp ? maxEp + 1 : 1;

    const episode = await Episode.create({
      userId: user.id,
      showId,
      episodeNumber: newEpisodeNumber,
      episodeTitle,
      episodeDesc,
      guestInfo,
      duration,
      size,
      tags,
      episodeImage: imgUrl,
      episodeUrl: episodeUrl,
      explicit,
      published,
      downloads,
    });

    return res.status(201).json(episode);
  } catch(error) {
    console.error(error);
    return next({
      message: 'An error occurred while creating this episode.',
      status: 400,
      error
    })
  }
})

module.exports = router;

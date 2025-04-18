const express = require('express');
const { Episode } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get one Episode by Id

router.get('/:episodeId', async (req, res, next) => {
  try {
    let { episodeId } = req.params;
    let episode = await Episode.findByPk(episodeId);

    if (!episode) {
      return res.status(404).json({ message: "Episode could not be found"})
    }
    let response = {
      ...episode.toJSON()
    };
    return res.json(response);
  } catch(error) {
    next(error)
  }
})

// Delete an Episode
router.delete('/:episodeId', requireAuth, handleValidationErrors, async (req, res, next) => {
  try {
    let { user } = req;
    let { episodeId } = req.params;
    let episode = await Episode.findByPk(episodeId)

    if (!episode) {
      res.status(404).json({ message: "Show couldn't be found"})
    } else if (episode.userId !== user.id) {
      return res.status(404).json({ message: "User must own episode to delete"})
    } else {
      await episode.destroy();
      return res.json({ episodeId })
    }
  } catch(error) {
    next(error)
  }
})

module.exports = router;

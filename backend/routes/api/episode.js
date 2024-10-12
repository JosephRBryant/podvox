// const express = require('express');
// const { requireAuth } = require('../../utils/auth')
// const { handleValidationErrors } = require('../../utils/validation');

// const router = express.Router();

// // Create an Episode
// router.post('/', requireAuth, handleValidationErrors, async (req, res, next) => {
//   try {
//     const { user } = req;
//     if (user) {
//       const {
//         userId,
//         showId,
//         episodeTitle,
//         episodeDesc,
//         guestInfo,
//         pubDate,
//         duration,
//         size,
//         tags,
//         episodeImage,
//         explicit,
//         published,
//         prefix,
//         downloads
//       } =
//     }
//   } catch(error) {
//     error.message = "Bad Request";
//     error.status = 400;
//     next(error)
//   }
// })

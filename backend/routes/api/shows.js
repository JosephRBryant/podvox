const express = require('express');
const { check } = require('express-validator');
const { Show } = require('../../db/models')

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

module.exports = router;

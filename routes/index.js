const express = require('express');

const router = express.Router();
const userRoutes = require('./user');
const movieRoutes = require('./movie');

router.use(userRoutes);
router.use(movieRoutes);

module.exports = router;

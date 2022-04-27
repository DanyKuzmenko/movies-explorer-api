const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/http(s)?:\/\/\S+[^\s]\.\S+/),
    trailer: Joi.string().required().regex(/http(s)?:\/\/\S+[^\s]\.\S+/),
    thumbnail: Joi.string().required().regex(/http(s)?:\/\/\S+[^\s]\.\S+/),
    movieId: Joi.string().required().hex(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/movies/_id', deleteMovie);

module.exports = router;

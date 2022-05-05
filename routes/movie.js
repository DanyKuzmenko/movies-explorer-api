const express = require('express');
const validator = require('validator');
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middlewares/auth');

const router = express.Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/movies', auth, getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Необходимо ввести ссылку в поле image');
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Необходимо ввести ссылку в поле trailerLink');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Необходимо ввести ссылку в поле thumbnail');
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), auth, createMovie);
router.delete('/movies/:movieId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), auth, deleteMovie);

module.exports = router;

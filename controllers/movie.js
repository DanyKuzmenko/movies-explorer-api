const Movie = require('../models/movie');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorForbidden = require('../errors/ErrorForbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      const userMovies = movies.filter((movie) => movie.owner.toString() === req.user._id);
      res.send({ data: userMovies });
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы неккоректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new ErrorNotFound(`Фильма с id: ${req.params.movieId} не существует`);
    })
    .then((deleteMovie) => {
      if (deleteMovie.owner.toString() !== req.user._id) {
        throw new ErrorForbidden('Вы не можете удалять чужие карточки');
      }
      return Movie.findByIdAndDelete(req.params.movieId)
        .then((movie) => {
          res.send({
            country: movie.country,
            director: movie.director,
            duration: movie.duration,
            year: movie.year,
            description: movie.description,
            image: movie.image,
            trailerLink: movie.trailerLink,
            nameRU: movie.nameRU,
            nameEN: movie.nameEN,
            thumbnail: movie.thumbnail,
            movieId: movie.movieId,
            _id: movie._id,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Передан неккоректный id фильма'));
      } else {
        next(err);
      }
    });
};

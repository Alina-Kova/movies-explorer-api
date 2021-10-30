const Movie = require('../models/movies');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  BAD_MOVIE_DATA_REQUEST,
  NOT_FOUND_MOVIE_ID,
  FORBIDDEN_ERROR,
  VALIDATION_ERROR,
  CAST_ERROR,
  SUCCESSFULLY_DELETED,
} = require('../utils/constants');

// контроллер поиска фиальма
module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch(next);
};

// контроллер создания нового фиальма
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === CAST_ERROR || err.name === VALIDATION_ERROR) {
        const error = new IncorrectDataError(BAD_MOVIE_DATA_REQUEST);
        return next(error);
      }
      return next(err);
    });
};

// контроллер удаления фиальма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND_MOVIE_ID);
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(FORBIDDEN_ERROR);
      }
      return Movie.remove(req.params.movieId)
        .then(() => {
          res.status(200).send({ message: SUCCESSFULLY_DELETED });
        });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR || err.name === VALIDATION_ERROR) {
        const error = new IncorrectDataError(BAD_MOVIE_DATA_REQUEST);
        return next(error);
      }
      return next(err);
    });
};

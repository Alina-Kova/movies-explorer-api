const Movie = require('../models/movies');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const ForbiddenError = require('../errors/forbidden-err');

// контроллер поиска фиальма
module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
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
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        const error = new IncorrectDataError('Переданы некорректные данные.');
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
        // const error = new NotFoundError('Фильм с указанным _id не найден.');
        // return next(error);
        throw new NotFoundError('Фильм с указанным _id не найден.');
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Невозможно удалить фильм, он создан другим пользователем.');
      }
      Movie.findByIdAndDelete(req.params.id)
        .then((movieRemoval) => {
          res.send({ data: movieRemoval });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        const error = new IncorrectDataError('Переданы некорректные данные.');
        return next(error);
      }
      return next(err);
    });
};

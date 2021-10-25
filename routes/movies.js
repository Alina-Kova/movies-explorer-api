const movies = require('express').Router();
const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');
const { validateId, validateNewMovie } = require('../middlewares/validator');

movies.get('/', getMovie);
movies.post('/', validateNewMovie, createMovie);
movies.delete('/:movieId', validateId, deleteMovie);

module.exports = movies;

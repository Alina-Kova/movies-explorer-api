const movies = require('express').Router();
const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');
const { validateId, validateNewMovie } = require('../middlewares/validator');

movies.get('/movies', getMovie);
movies.post('/movies', validateNewMovie, createMovie);
movies.delete('/movies/:movieId', validateId, deleteMovie);

module.exports = movies;

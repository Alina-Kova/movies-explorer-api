const movies = require('express').Router();
const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');

movies.get('/movies', getMovie);
movies.post('/movies', createMovie);
movies.delete('/movies/:movieId', deleteMovie);

module.exports = movies;

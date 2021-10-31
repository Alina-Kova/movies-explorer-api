const mongoose = require('mongoose');
const validator = require('validator');
const { INVALID_URL_FORMAT } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator: (image) => validator.isURL(image, { protocols: ['http', 'https'], require_protocol: true }),
      message: INVALID_URL_FORMAT,
    },
  },
  trailer: {
    type: String,
    require: true,
    validate: {
      validator: (trailer) => validator.isURL(trailer, { protocols: ['http', 'https'], require_protocol: true }),
      message: INVALID_URL_FORMAT,
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (thumbnail) => validator.isURL(thumbnail, { protocols: ['http', 'https'], require_protocol: true }),
      message: INVALID_URL_FORMAT,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);

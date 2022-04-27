const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate(image) {
      return /http(s)?:\/\/\S+[^\s]\.\S+/.test(image);
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate(trailerLink) {
      return /http(s)?:\/\/\S+[^\s]\.\S+/.test(trailerLink);
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate(thumbnail) {
      return /http(s)?:\/\/\S+[^\s]\.\S+/.test(thumbnail);
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);

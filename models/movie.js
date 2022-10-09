const mongoose = require('mongoose');
const { regExp } = require('../constants/constants');

const ObjectID = mongoose.Schema.Types.ObjectId;

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Не должно быть пустым'],
  },
  director: {
    type: String,
    required: [true, 'Не должно быть пустым'],
  },
  duration: {
    type: Number,
    required: [true, 'Не должно быть пустым'],
  },
  year: {
    type: String,
    required: [true, 'Не должно быть пустым'],
  },
  description: {
    type: String,
    required: [true, 'Не должно быть пустым'],
  },
  image: {
    type: String,
    required: [true, 'Не должно быть пустым'],
    validate: {
      validator(v) {
        return regExp.link.test(v);
      },
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Не должно быть пустым'],
    validate: {
      validator(v) {
        return regExp.link.test(v);
      },
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Не должно быть пустым'],
    validate: {
      validator(v) {
        return regExp.link.test(v);
      },
    },
  },
  owner: {
    type: ObjectID,
    ref: 'user',
    required: [true, 'Не должно быть пустым'],
  },
  movieId: {
    type: ObjectID,
    ref: 'movie',
    required: [true, 'Не должно быть пустым'],
  },
  nameRU: {
    type: String,
    required: [true, 'Не должно быть пустым'],
  },
  nameEN: {
    type: String,
    required: [true, 'Не должно быть пустым'],
  },
});

module.exports = mongoose.model('movie', movieSchema);

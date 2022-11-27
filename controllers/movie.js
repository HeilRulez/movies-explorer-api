const Movie = require('../models/movie');
const {
  OK_ADD, BadRequestError, NotFoundError,
} = require('../constants/statusCodes');
const {
  badRequestMessage, notFoundMovieMessage,
} = require('../constants/messageErrorsRU');

module.exports.getSaveMovie = async (req, res, next) => {
  try {
    const savedMovies = await Movie.find({});
    res.send(savedMovies);
  } catch (err) {
    next(err);
  }
};

module.exports.cerateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });
    res.status(OK_ADD).send(movie);
  } catch (err) {
    next(err);
  }
};

module.exports.delMovie = async (req, res, next) => {
  try {
    const movie = await Movie.find({ movieId: req.params._id });
    if (!movie) {
      throw new NotFoundError(notFoundMovieMessage);
    } else {
      const itemMovie = movie.filter((item) => req.user._id === item.owner)[0];
      await Movie.deleteOne(itemMovie);
      res.send(itemMovie);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(badRequestMessage));
      return;
    }
    next(err);
  }
};

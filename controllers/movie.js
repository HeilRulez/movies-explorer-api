const Movie = require('../models/movie');
const {
  OK_ADD, BadRequestError, NotFoundError, ForbiddenError,
} = require('../constants/statusCodes');
const {
  badRequestMessage, notFoundMovieMessage, forbiddenMessage,
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
    const movie = await Movie.findOne({ movieId: req.params._id });
    if (!movie) {
      throw new NotFoundError(notFoundMovieMessage);
    } else if (req.user._id !== movie.owner) {
      throw new ForbiddenError(forbiddenMessage);
    }
    await Movie.findOneAndDelete({ movieId: req.params._id });
    res.send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(badRequestMessage));
      return;
    }
    next(err);
  }
};

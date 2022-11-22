const Movie = require('../models/movie');
const {
  OK_ADD, BadRequestError, NotFoundError, ConflictError, ForbiddenError,
} = require('../constants/statusCodes');
const {
  badRequestMessage, notFoundMovieMessage, conflictMovieMessage, forbiddenMessage,
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
  const { id } = req.body;
  let movie;
  try {
    movie = await Movie.findOne({ id });
    if (movie) {
      next(new ConflictError(conflictMovieMessage));
      return;
    }
    movie = await Movie.create({ ...req.body, owner: req.user._id });
    res.status(OK_ADD).send(movie);
  } catch (err) {
    next(err);
  }
};

module.exports.delMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ id: req.params._id });
    if (!movie) {
      throw new NotFoundError(notFoundMovieMessage);
    } else if (req.user._id !== movie.owner) {
      throw new ForbiddenError(forbiddenMessage);
    }
    await Movie.findOneAndDelete({ id: req.params._id });
    res.send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(badRequestMessage));
      return;
    }
    next(err);
  }
};

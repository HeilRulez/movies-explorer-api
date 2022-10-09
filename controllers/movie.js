const Movie = require('../models/movie');
const {
  OK, OK_ADD, BadRequestError, NotFoundError, ConflictError,
} = require('../constants/statusCodes');

module.exports.getSaveMovie = async (req, res, next) => {
  try {
    const savedMovies = await Movie.find({});
    res.status(OK).send(savedMovies);
  } catch (err) {
    next(err);
  }
};

module.exports.cerateMovie = async (req, res, next) => {
  const { movieId } = req.body;
  try {
    const movie = await Movie.findById(movieId);
    if (movie) {
      next(new ConflictError('Этот фильм уже добавлен.'));
      return;
    }
    const newMovie = await Movie.create(req.body);
    res.status(OK_ADD).send(newMovie);
  } catch (err) {
    next(err);
  }
};

module.exports.delMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params._id);
    if (!movie) {
      throw new NotFoundError('Фильм отсутствут.');
    }
    res.status(OK).send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неверные данные запроса.'));
      return;
    }
    next(err);
  }
};

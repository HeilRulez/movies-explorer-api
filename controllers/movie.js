const Movie = require('../models/movie');
const {
  OK, OK_ADD, BadRequestError, NotFoundError, ConflictError, ForbiddenError,
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
  let movie;
  try {
    movie = await Movie.findOne({ movieId });
    if (movie) {
      next(new ConflictError('Этот фильм уже добавлен.'));
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
    const movie = await Movie.findById(req.params._id);
    if (!movie) {
      throw new NotFoundError('Фильм отсутствут.');
    } else if (req.user._id !== movie.owner) {
      throw new ForbiddenError('Нет прав для данного действия.');
    }
    await Movie.findByIdAndDelete(req.params._id);
    res.status(OK).send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неверные данные запроса.'));
      return;
    }
    next(err);
  }
};

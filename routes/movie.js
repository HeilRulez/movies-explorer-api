const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regExp } = require('../constants/constants');
const { getSaveMovie, cerateMovie, delMovie } = require('../controllers/movie');

routes.get('/', getSaveMovie);
routes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regExp.link),
    trailerLink: Joi.string().required().regex(regExp.link),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(regExp.link),
    movieId: Joi.string().alphanum().hex().length(24),
  }),
}), cerateMovie);
routes.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().hex().length(24),
  }),
}), delMovie);

module.exports = routes;

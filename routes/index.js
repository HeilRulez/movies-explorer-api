const routes = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const { regExp } = require('../constants/constants');
const {
  getUserInfo, setUserInfo, outUser, createUser, login,
} = require('../controllers/user');
const { getSaveMovie, cerateMovie, delMovie } = require('../controllers/movie');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../constants/statusCodes');
const app = require('../app');

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
routes.use(auth);

routes.get('/users/me', getUserInfo);
routes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: true } }),
  }),
}), setUserInfo);
routes.post('/users/signout', outUser);

routes.get('/movie', getSaveMovie);
routes.post('/movie', celebrate({
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
routes.delete('/movie/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().hex().length(24),
  }),
}), delMovie);

routes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

app.use(errors());

module.exports = routes;

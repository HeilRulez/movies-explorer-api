const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

function validLink(link, helpers) {
  if (!validator.isURL(link)) {
    return helpers.error('any.invalid');
  }
  return link;
}

module.exports.validCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validSetUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: true } }),
  }),
});

module.exports.validCerateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validLink),
    trailerLink: Joi.string().required().custom(validLink),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(validLink),
    movieId: Joi.number().required(),
  }),
});

module.exports.validDelMovie = celebrate({
  params: Joi.object().keys({
    _id: Joi.number().required(),
  }),
});

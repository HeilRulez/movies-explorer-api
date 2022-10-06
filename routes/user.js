const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, setUserInfo, outUser } = require('../controllers/user');

routes.get('/me', getUserInfo);
routes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: true } }),
  }),
}), setUserInfo);
routes.post('/signout', outUser);

module.exports = routes;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { reqLogger, errLogger } = require('./middlewares/logger');
const routesUser = require('./routes/user');
const routesMovie = require('./routes/movie');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { corsUrl } = require('./constants/constants');
const { OTHER_SEREVER_ERROR, NotFoundError } = require('./constants/statusCodes');

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(cors({
  origin: corsUrl,
  credentials: true,
}));
app.use(express.json());
app.use(reqLogger);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.use(auth);
app.use('/users', routesUser);
app.use('/movie', routesMovie);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});
app.use(errLogger);
app.use(errors());

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    res.status(OTHER_SEREVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
});

module.exports = app;

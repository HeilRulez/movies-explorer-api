require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { mongodb, corsUrl } = require('./configApp');
const { reqLogger, errLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errors');

const app = express();

mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});
app.use(helmet());
app.use(cors({
  origin: corsUrl,
  credentials: true,
}));
app.use(express.json());
app.use(reqLogger);
app.use(limiter);
app.use(routes);
app.use(errors());
app.use(errLogger);
app.use(errorHandler);

module.exports = app;

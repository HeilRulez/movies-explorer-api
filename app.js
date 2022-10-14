const { NODE_ENV, DB_NAME, CORS_URL } = process.env;
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { reqLogger, errLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errors');

const app = express();

mongoose.connect(`mongodb://localhost:27017/${NODE_ENV === 'production' ? DB_NAME : 'nameDb'}`, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});
app.use(helmet());
app.use(cors({
  origin: CORS_URL,
  credentials: true,
}));
app.use(express.json());
app.use(reqLogger);
app.use(routes);
app.use(errLogger);
app.use(errorHandler);

module.exports = app;

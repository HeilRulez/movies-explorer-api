const { OTHER_SEREVER_ERROR } = require('../constants/statusCodes');

module.exports = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(OTHER_SEREVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};

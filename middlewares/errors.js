const { OTHER_SEREVER_ERROR } = require('../constants/statusCodes');
const { otherErrorsMessage } = require('../constants/messageErrorsRU');

module.exports = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(OTHER_SEREVER_ERROR).send({ message: otherErrorsMessage });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configApp');
const { UnauthorizedError } = require('../constants/statusCodes');
const { unauthorizedMessage } = require('../constants/messageErrorsRU');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  try {
    const token = cookie.replace('jwt=', '');
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (err) {
    next(new UnauthorizedError(unauthorizedMessage));
  }
};

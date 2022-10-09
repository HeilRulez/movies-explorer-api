const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports = {
  OK: 200,
  OK_ADD: 201,
  OTHER_SEREVER_ERROR: 500,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
};

const winston = require('winston');
const expWin = require('express-winston');

module.exports.reqLogger = expWin.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

module.exports.errLogger = expWin.errorLogger({
  transport: [
    new winston.transport.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

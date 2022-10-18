const { rateLimit } = require('express-rate-limit');

module.exports.limiter = rateLimit({
  windowMs: 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const {
  NODE_ENV, JWT_SECRET, DB_NAME, CORS_URL,
} = process.env;

module.exports = {
  mongodb: `mongodb:${NODE_ENV === 'production' ? DB_NAME : '//localhost:27017/moviesdb'}`,
  corsUrl: CORS_URL,
  jwtSecret: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
};

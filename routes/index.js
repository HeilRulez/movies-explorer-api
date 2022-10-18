const routes = require('express').Router();

const {
  getUserInfo, setUserInfo, outUser, createUser, login,
} = require('../controllers/user');
const {
  validCreateUser, validLogin, validSetUserInfo, validCerateMovie, validDelMovie,
} = require('../middlewares/validations');
const { getSaveMovie, cerateMovie, delMovie } = require('../controllers/movie');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../constants/statusCodes');
const { notFoundPageMessage } = require('../constants/messageErrorsRU');

routes.post('/signup', validCreateUser, createUser);
routes.post('/signin', validLogin, login);
routes.use(auth);

routes.get('/users/me', getUserInfo);
routes.patch('/users/me', validSetUserInfo, setUserInfo);
routes.post('/users/signout', outUser);

routes.get('/movies', getSaveMovie);
routes.post('/movies', validCerateMovie, cerateMovie);
routes.delete('/movies/:_id', validDelMovie, delMovie);

routes.use('*', (req, res, next) => {
  next(new NotFoundError(notFoundPageMessage));
});

module.exports = routes;

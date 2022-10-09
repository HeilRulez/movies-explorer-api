const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const {
  OK, OK_ADD, BadRequestError, UnauthorizedError, ConflictError,
} = require('../constants/statusCodes');

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    res.status(OK).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.setUserInfo = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true },
    );
    res.status(OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Неверные данные запроса.'));
      return;
    }
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const pasHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: pasHash,
    });
    res.status(OK_ADD).send(user.toJSON());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Неверные данные запроса.'));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError('Такой пользователь уже зарегистрирован.'));
      return;
    }
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    throw new BadRequestError('Некорректный Email.');
  } else {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль.');
      } else if (!bcrypt.compare(password, user.password)) {
        throw new UnauthorizedError('Неправильные почта или пароль.');
      } else {
        const token = await jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );
        res.status(OK).cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
          .send(user.toJSON())
          .end();
      }
    } catch (err) {
      next(err);
    }
  }
};
module.exports.outUser = async (req, res, next) => {
  try {
    res.status(OK).cookie('jwt', '', {
      httpOnly: true,
    })
      .send({});
  } catch (err) {
    next(err);
  }
};

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecret } = require('../configApp');
const {
  OK_ADD, BadRequestError, UnauthorizedError, ConflictError,
} = require('../constants/statusCodes');
const { badRequestMessage, noValidLoginMessage, conflictUserMessage } = require('../constants/messageErrorsRU');

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.setUserInfo = async (req, res, next) => {
  try {
    await User.findOne(req.body);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.codeName === 'DuplicateKey') {
      next(new ConflictError(conflictUserMessage));
      return;
    }
    if (err.name === 'ValidationError') {
      next(new BadRequestError(badRequestMessage));
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
    const pasHash = await bcryptjs.hash(password, 10);
    const user = await User.create({
      name, email, password: pasHash,
    });
    res.status(OK_ADD).send(user.toJSON());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(badRequestMessage));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError(conflictUserMessage));
      return;
    }
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError(noValidLoginMessage);
    } else if (!(await bcryptjs.compare(password, user.password))) {
      throw new UnauthorizedError(noValidLoginMessage);
    } else {
      const token = await jwt.sign(
        { _id: user._id },
        jwtSecret,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send(user.toJSON())
        .end();
    }
  } catch (err) {
    next(err);
  }
};

module.exports.outUser = async (req, res, next) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
    })
      .send({});
  } catch (err) {
    next(err);
  }
};

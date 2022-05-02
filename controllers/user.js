const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorConflict = require('../errors/ErrorConflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .orFail(() => {
      throw new ErrorNotFound('Пользователя с таким email не существует');
    })
    .then((user) => {
      if (user._id.toString() !== req.user._id) {
        throw new ErrorConflict('Пользователь с таким email уже существует');
      }
      if (user.name === name) {
        throw new ErrorBadRequest('Необходимо ввести новые данные пользователя');
      }
      return User.findByIdAndUpdate(req.user._id, {
        name,
        email,
      }, {
        new: true,
        runValidators: true,
      })
        .then((user) => {
          res.send({
            name: user.name,
            email: user.email,
          });
        })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы неккоректные данные при обновлении пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ message: token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict('Пользователь с таким email уже существует');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({ name, email, password: hash })
        .then((user) => {
          res.send({
            name: user.name,
            email: user.email,
            _id: user._id,
          });
        })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы неккоректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

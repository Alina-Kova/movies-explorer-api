const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const AuthorizationError = require('../errors/auth-err');
const ExistingDataError = require('../errors/existing-data-err');

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError('Пользователь с указанным _id не найден.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      // eslint-disable-next-line no-shadow
      const { _id, email } = user;
      res.status(200).send({ _id, email });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new ExistingDataError('Пользователь с указанным email уже существует.');
        return next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new IncorrectDataError('Переданы некорректные данные при создании пользователя.');
        return next(error);
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email },
    {
      runValidators: true, // валидация данных
      new: true, // получаем в then обновлённую запись
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'MongoError') {
        next(new ExistingDataError('Пользователь с указанным email уже существует.'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      throw new AuthorizationError('Передан неверный логин или пароль.');
    })
    .catch(next);
};

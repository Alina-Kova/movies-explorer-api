const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/config');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const AuthorizationError = require('../errors/auth-err');
const ExistingDataError = require('../errors/existing-data-err');

// контроллер получения информации текущего пользователя
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new IncorrectDataError('Переданы некорректные данные.');
        return next(error);
      }
      return next(err);
    });
};

// контроллер создания нового пользователя
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
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new ExistingDataError('Пользователь с указанным email уже существует.');
        return next(error);
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new IncorrectDataError('Переданы некорректные данные при создании пользователя.');
        return next(error);
      }
      return next(err);
    });
};

// контроллер обновления информации пользователя
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

// контроллер входа в аккаунт
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
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

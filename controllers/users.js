const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/config');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const AuthorizationError = require('../errors/auth-err');
const ExistingDataError = require('../errors/existing-data-err');
const {
  USER_NOT_FOUND,
  CONFLICT_EMAIL_ERROR,
  BAD_DATA_REQUEST,
  NOT_FOUND_USER_ID,
  BAD_UPDATE_REQUEST,
  UNAUTHORIZED_ERROR,
  MONGO_ERROR,
  VALIDATION_ERROR,
  CAST_ERROR,
} = require('../utils/constants');

// контроллер получения информации текущего пользователя
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
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
      if (err.code === 11000) {
        const error = new ExistingDataError(CONFLICT_EMAIL_ERROR);
        return next(error);
      }
      if (err.name === VALIDATION_ERROR || err.name === CAST_ERROR) {
        const error = new IncorrectDataError(BAD_DATA_REQUEST);
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
        throw new NotFoundError(NOT_FOUND_USER_ID);
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR || err.name === CAST_ERROR) {
        next(new IncorrectDataError(BAD_UPDATE_REQUEST));
      } else if (err.name === MONGO_ERROR) {
        next(new ExistingDataError(CONFLICT_EMAIL_ERROR));
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
      throw new AuthorizationError(UNAUTHORIZED_ERROR);
    })
    .catch(next);
};

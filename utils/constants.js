const USER_NOT_FOUND = 'Пользователь не найден.';
const CONFLICT_EMAIL_ERROR = 'Пользователь с указанным email уже существует.';
const BAD_DATA_REQUEST = 'Переданы некорректные данные при создании пользователя.';
const NOT_FOUND_USER_ID = 'Пользователь с указанным _id не найден.';
const BAD_UPDATE_REQUEST = 'Переданы некорректные данные при обновлении профиля.';
const UNAUTHORIZED_ERROR = 'Передан неверный логин или пароль.';
const VALIDATION_ERROR = 'ValidationError';
const CAST_ERROR = 'CastError';
const BAD_MOVIE_DATA_REQUEST = 'Переданы некорректные данные.';
const NOT_FOUND_MOVIE_ID = 'Фильм с указанным _id не найден.';
const FORBIDDEN_ERROR = 'Невозможно удалить фильм, он создан другим пользователем.';
const SUCCESSFULLY_DELETED = 'Фильм успешно удален.';
const RESOURCE_NOT_FOUND = 'Запрашиваемый ресурс не найден.';
const SERVER_SHUTDOWN = 'Сервер сейчас упадёт';
const INVALID_DATA = 'Неправильные почта или пароль';
const INVALID_EAMIL_FORMAT = 'Неправильный формат почты.';
const INVALID_URL_FORMAT = 'Неправильный формат cсылки.';
const AUTH_REQUIRED = 'Необходима авторизация';
const SERVER_ERROR = 'На сервере произошла ошибка';

module.exports = {
  USER_NOT_FOUND,
  CONFLICT_EMAIL_ERROR,
  BAD_DATA_REQUEST,
  NOT_FOUND_USER_ID,
  BAD_UPDATE_REQUEST,
  UNAUTHORIZED_ERROR,
  VALIDATION_ERROR,
  CAST_ERROR,
  BAD_MOVIE_DATA_REQUEST,
  NOT_FOUND_MOVIE_ID,
  FORBIDDEN_ERROR,
  SUCCESSFULLY_DELETED,
  RESOURCE_NOT_FOUND,
  SERVER_SHUTDOWN,
  INVALID_DATA,
  INVALID_EAMIL_FORMAT,
  INVALID_URL_FORMAT,
  AUTH_REQUIRED,
  SERVER_ERROR,
};

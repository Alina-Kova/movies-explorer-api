const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/auth-err');
const { JWT_SECRET } = require('../utils/config');
const { AUTH_REQUIRED } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError(AUTH_REQUIRED);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizationError(AUTH_REQUIRED);
  }

  req.user = payload;

  next();
};

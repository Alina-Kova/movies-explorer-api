const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validateSignup, validateLogin } = require('../middlewares/validator');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const NotFoundError = require('../errors/not-found-err');
const { RESOURCE_NOT_FOUND } = require('../utils/constants');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateLogin, login);

router.use(auth, usersRoutes);
router.use(auth, moviesRoutes);

// обрабатываем ошибку 404
router.use('*', () => {
  throw new NotFoundError(RESOURCE_NOT_FOUND);
});

module.exports = router;

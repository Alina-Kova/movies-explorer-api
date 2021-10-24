const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { loginValidation, signupValidation } = require('../middlewares/validator');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', loginValidation, login);
router.post('/signup', signupValidation, createUser);

router.use(auth, usersRoutes);
router.use(auth, moviesRoutes);

// обрабатываем ошибку 404
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

module.exports = router;

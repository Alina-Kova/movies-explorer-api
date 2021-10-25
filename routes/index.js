const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { loginValidation, signupValidation } = require('../middlewares/validator');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', signupValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth);
router.use('/users', usersRoutes);
router.use('/movies', moviesRoutes);

// обрабатываем ошибку 404
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

module.exports = router;

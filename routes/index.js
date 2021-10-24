const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth, usersRoutes);
router.use(auth, moviesRoutes);

// обрабатываем ошибку 404
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

module.exports = router;

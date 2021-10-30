require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const middlewaresErrors = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes');
const { DATA_BASE, PORT } = require('./utils/config');

const app = express();

// подключаемся к серверу mongo
mongoose.connect(DATA_BASE);

const corsOptions = [
  'http://localhost:3001',
  'https://movies.poisk.nomoredomains.rocks',
  'https://api.movies.poisk.nomoredomains.rocks',
  'http://movies.poisk.nomoredomains.rocks',
  'http://api.movies.poisk.nomoredomains.rocks',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (corsOptions.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(middlewaresErrors);

app.listen(PORT);

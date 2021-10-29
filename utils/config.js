// require('dotenv').config();
const { DATA_BASE = 'mongodb://localhost:27017/moviesdb' } = process.env;
const { JWT_SECRET = 'dev-secret' } = process.env;
const { PORT = 3001 } = process.env;

module.exports = {
  DATA_BASE,
  JWT_SECRET,
  PORT,
};

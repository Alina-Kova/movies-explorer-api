const users = require('express').Router();
const { getMe, updateProfile } = require('../controllers/users');
const { validateUserData } = require('../middlewares/validator');

users.get('/me', getMe);
users.patch('/me', validateUserData, updateProfile);

module.exports = users;

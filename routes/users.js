const users = require('express').Router();
const { getMe, updateProfile } = require('../controllers/users');
const { validateUserData } = require('../middlewares/validator');

users.get('/users/me', getMe);
users.patch('/users/me', validateUserData, updateProfile);

module.exports = users;

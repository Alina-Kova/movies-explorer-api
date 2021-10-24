const users = require('express').Router();
const { getMe, updateProfile } = require('../controllers/users');

users.get('/users/me', getMe);
users.patch('/users/me', updateProfile);

module.exports = users;

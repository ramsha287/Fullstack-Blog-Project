const express = require('express');
const authRoutes = express.Router();
const {getLogin,login,register,getRegister, logout} = require('../controllers/authController');
const auth = require('../middlewares/auth');

//render login page
authRoutes.get('/login', getLogin);

//main logic for user login
authRoutes.post('/login', login);

//render register page
authRoutes.get('/register', getRegister);

//main logic for user registration
authRoutes.post('/register', register);

//Logout
authRoutes.get('/logout', logout);

module.exports = authRoutes;
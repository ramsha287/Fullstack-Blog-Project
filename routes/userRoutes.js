const express = require('express');
const userRoutes = express.Router();
const {getUserProfile,getEditProfileForm,updateUserProfile, deleteUserAccount} = require('../controllers/userController');
const { ensureAuthenticated } = require('../middlewares/auth');
const upload = require('../config/multer');

//render login page
userRoutes.get('/profile', ensureAuthenticated, getUserProfile);
//render edit profile page
userRoutes.get('/edit', ensureAuthenticated, getEditProfileForm);
userRoutes.post('/delete', ensureAuthenticated, deleteUserAccount);

userRoutes.post('/edit', ensureAuthenticated,upload.single("profilePicture"), updateUserProfile);


module.exports = userRoutes;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const asyncHandler = require("express-async-handler");

//render login page
exports.getLogin = asyncHandler((req, res) => {
    res.render("login",{
        title: "Login",
        user: req.user,
        error: "",
    });
});

//main logic for user login
exports.login = asyncHandler(async (req, res, next) => {
    passport.authenticate("local",(err,user,info)=>{
     if (err){
         return next(err);
     }
     if (!user){
         return res.redirect("login",{
             title: "Login",
             user: req.user,
             error: info.message,
         });
     }
     req.logIn(user,(err)=>{
         if (err){
             return next(err);
         }
         return res.redirect("/user/profile");
     });
    })(req,res,next);
 });


//render register page
exports.getRegister = asyncHandler((req, res) => {
    res.render("register",{
        title: "Register",
        user: req.user,
        error: null
    });
});

exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("register", {
                title: "Register",
                user: req.user,
                error: "User already exists",
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.redirect("/auth/login");
    } catch (error) {
        res.render("register", {
            title: "Register",
            user: req.user,
            error: error.message,
        });
    }
    
});

//logout
exports.logout = asyncHandler((req, res) => {
    req.logout((err)=>{
        if (err){
            return next(err);
        }
        res.redirect("/auth/login");
    });
});
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

module.exports = function(passport) {
    //Define the local strategy for email and password
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
        try{
            //find user
            const user = await User.findOne({email});
            if(!user){
                return done(null, false, {message: 'User not found with the email'});
            }
            //compare the provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return done(null, false, {message: 'Incorrect password'});
            }
            //authentication successful
            return done(null, user);
        }catch(error){
            return done(error);
        }
    }));
    //Serialize user:Determines which data of the user object should be stored in the session.here we are storing the user id
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    //Deserialize user:Retrieves the whole user object from the user id stored in the session
    passport.deserializeUser(async function(id, done){
        try{
            const user = await User.findById(id);
            done(null, user);
        }catch(error){
            done(error);
        }
    });
};

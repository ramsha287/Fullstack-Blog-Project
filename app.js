require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const passportConfig = require('./config/passport');
const path = require('path');
const postRoutes = require('./routes/postRoutes');
const errorHandler = require('./middlewares/errorHandler');
const commentRoutes = require('./routes/commentRoutes');
const methodOverride = require('method-override');
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 3005;

//middleware
app.use(express.urlencoded({extended: true}));

//session middleware
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
}));

//method override middleware
app.use(methodOverride("_method"));

//passport 
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

//server static files
app.use(express.static(path.join(__dirname, 'public')));

//EJS
app.set('view engine', 'ejs');

//Home route
app.get("/", (req, res) => {
    res.render("home",{
        user: req.user,
        error:"",
        title:"Home",
    });
});

//routes
app.use("/auth",authRoutes);
app.use("/posts",postRoutes);
app.use("/",commentRoutes);
app.use("/user",userRoutes);

//error handler
app.use(errorHandler);

//start the server
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("Database connected");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(()=>{
    console.log("Database connection failed");
});

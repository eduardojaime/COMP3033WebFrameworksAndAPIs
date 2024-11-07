var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Load global configuration object and mongoose
var configs = require("./configs/globals");
var mongoose = require("mongoose");
// Import passport packages
var passport = require("passport");
var BasicStrategy = require("passport-http").BasicStrategy;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var projectsRouter = require("./routes/api/projects");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// Middleware configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Initialize and Configure Passport
app.use(passport.initialize());
passport.use(new BasicStrategy((username, password, done)=>{
  // Here you would typically compare the username and password against a database
  // For simplicity, we'll just hardcode the values but store them in .env file and configs
  if(username === configs.Credentials.Username && password === configs.Credentials.Password){
    console.log("Authentication successful");
    return done(null, true);
  }
  else {
    console.log("Authentication failed");
    return done(null, false);
  }
  /*
    // With a MongoDB database, you would do something like this:
    // you need to define a User model, have a registration page for users to sign up, and use this code
    User.findOne({username: username}, (err, user)=>{
      if(err) return done(err); // errors out
      if(!user) return done(null, false); // no user found, auth failed
      if(!user.verifyPassword(password)) return done(null, false); // password doesn't match, auth failed
      return done(null, user); // auth successful
    });
   */
}));
// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/projects", projectsRouter);

// MongoDB connection
mongoose
  .connect(configs.ConnectionStrings.MongoDB)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB. ", error);
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

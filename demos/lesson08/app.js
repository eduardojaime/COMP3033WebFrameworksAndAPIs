var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Configure DB connectivity
var mongoose = require("mongoose");
var configs = require("./config/globals");
// Import Security Packages
var passport = require("passport");
var BasicStrategy = require("passport-http").BasicStrategy;

var indexRouter = require("./routes/index");
// var usersRouter = require('./routes/users');
var projectsRouter = require("./routes/api/projects");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Initialize passport and strategy before routes definition
app.use(passport.initialize());
// Basic Strategy uses base64 encoded string with format 'username:password'
passport.use(new BasicStrategy((username, password, done) => {
  // Provide code to find user and validate password
  // hardcode credentials admin:default
  if (username == "admin" && password == "default") {
    console.log(`User ${username} authenticated successfully!`);
    return done(null, username);
  }
  else {
    console.log(`User ${username} authentication failed!`);
    return done(null, false); // false means no user was accepted
  }
  // Example with mongoose model from https://github.com/jaredhanson/passport-http
}));
// Routes definition
app.use("/", indexRouter);
// app.use('/users', usersRouter);
// call passport.authenticate() before router object
// no need to store sessions since we are using RESTful architecture
// In REST, client must provide ALL information that the server needs to process the request
app.use("/api/projects", passport.authenticate("basic", { session: false }), projectsRouter);

// Connect to DB after router/controller configuration
mongoose
  .connect(configs.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((message) => {
    console.log("App connected successfully!");
  })
  .catch((error) => {
    console.log("Error while connecting: " + error);
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

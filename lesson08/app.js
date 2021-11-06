var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Import the mongoose module and globals file
const mongoose = require('mongoose');
const config = require('./config/globals');

// Securing the API
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

var indexRouter = require('./routes/index');
const projectsRouter = require('./routes/api/projects');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Implement basic strategy
passport.use(new BasicStrategy((username, password, done) => {
  // For now let's hardcode username and password
  // admin:default encoded as YWRtaW46ZGVmYXVsdA==
  // admin:incorrectpswd encoded as YWRtaW46aW5jb3JyZWN0cHN3ZA==
  if (username == 'admin' && password == 'default') {
    console.log(`User ${username} authenticated successfully!`)
    return done(null, username);
  }
  else {
    console.log(`Authentication failed for user ${username}`)
    return done(null, false);
  }
  /*
    // Example using MongoDB model
    // taken from https://github.com/jaredhanson/passport-http
    User.findOne({ username: userid }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  */
}));

app.use('/', indexRouter);
// Best practice is to put all API related endpoints in their own section
app.use('/api/projects', passport.authenticate('basic', { session: false }), projectsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//Connect to Mongo DB after all controller/router configuration
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log('Connected successfully!');
  })
  .catch((error) => {
    console.log(`Error while connecting! ${reason}`);
  })

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

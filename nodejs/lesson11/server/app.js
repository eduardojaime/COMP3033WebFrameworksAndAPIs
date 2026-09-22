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

// Documenting the API
const swaggerUi = require('swagger-ui-express');

// Enable CORS using npm package
const cors = require('cors');

var indexRouter = require('./routes/index');
const projectsRouter = require('./routes/api/projects');
// create router object for v2
const projectsRouterV2 = require('./routes/api/v2/projects');

var app = express();

// 1) Load from YAML file
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./documentation/api-specification.yaml');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 2) Load from swagger-jsdoc comments
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerJSDoc = require('swagger-jsdoc');
const { Console } = require('console');
// Configure the options object
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Projects Manager API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/api/*.js'], // files containing annotations as above
};
// Create a Spec object
const swaggerSpec = swaggerJSDoc(options);
// Use it as the base OAS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3) Load from URL
// const options = {
//   swaggerOptions: {
//     url: 'http://petstore.swagger.io/v2/swagger.json'
//   }
// }
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Initialize passport module
app.use(passport.initialize());
// Enable cors
app.use(cors());

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
// Add version specific endpoints
app.use('/api/v1/projects', passport.authenticate('basic', { session: false }), projectsRouter);
app.use('/api/v2/projects', passport.authenticate('basic', { session: false }), projectsRouterV2);

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

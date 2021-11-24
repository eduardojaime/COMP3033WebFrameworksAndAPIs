var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Import mongoose and globals
const mongoose = require('mongoose');
const config = require('./config/globals');

// Securing the API
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

// Documenting the API
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const YAML = require('yamljs');

// Web App Endpoint routers
var indexRouter = require('./routes/index');
// API Endpoint routers
// const projectsRouter = require('./routes/api/projects'); // original router
const projectsRouter = require('./routes/api/v1/projects'); // original v1 router
const projectsRouterV2 = require('./routes/api/v2/projects'); // new version

var app = express();

// 1) Load from YAML file
// const swaggerDocument = YAML.load('./documentation/api-specification.yaml');
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// 2) Load from comments with swagger-jsdoc
// Create options object
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Project Manager API',
//       version: '1.0.0'
//     }
//   },
//   apis: ['./routes/api/*.js'] // list of paths where path information is extracted from
// };
// // create a spec object
// const swaggerSpec = swaggerJSDoc(options);
// // set it up
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// 3) Loading an OAS document from a link
const options = {
  swaggerOptions: {
    url: 'https://petstore.swagger.io/v2/swagger.json'
  }
};
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(null, options));


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

// Implement basic authentication strategy
passport.use(new BasicStrategy((username, password, done) => {
  // Add logic to authenticate against provided username and password
  // Credentials come from the request, as a header value in the following format:
  // username:password
  // For now let's hardcode a username and password combination
  // admin:default encoded as YWRtaW46ZGVmYXVsdA==
  // admin:incorrectpswd encoded as YWRtaW46aW5jb3JyZWN0cHN3ZA==
  if (username == 'admin' && password == 'default') {
    console.log(`User ${username} authenticated successfully!`)
    return done(null, username);
  }
  else {
    console.log(`Authentication failed for user ${username}`);
    return done(null, false); // false indicates auth failed
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

// Endpoints
app.use('/', indexRouter);
// enable endpoint
// protect the endpoint by calling passport.authenticate()
// keep the observable behaviour
app.use('/api/projects', // Endpoint
        passport.authenticate('basic', { session: false }), // Security middleware
        projectsRouter); // Processing middleware
// enable new endpoints
app.use('/api/v1/projects', 
        passport.authenticate('basic', {session: false}),
        projectsRouter);
app.use('/api/v2/projects',
        passport.authenticate('basic', { session: false }),
        projectsRouterV2);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Connect to mongo db after the router configuration
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
.then((message) => {
  console.log('Connected successfully!');
})
.catch((error) => {
  console.log(`Error while connecting! ${error}`);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

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
// Import OpenAPI packages
var swaggerUI = require("swagger-ui-express");
// 1) Loading API documentation from a YAML file
var YAML = require("yamljs");
var swaggerDocument = YAML.load("./documentation/api-specs.yaml");
// 2) Generating API documentation from comments in code
var swaggerJsdoc = require("swagger-jsdoc");
var options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project Tracker API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/api/*.js"], // any file under /routes/api that's a js file
};
var swaggerSpec = swaggerJsdoc(options);
// 3) Loading API documentation from cloud location
var specFileUrl = "https://petstore.swagger.io/v2/swagger.json";
var optionsForUrl = {
  swaggerOptions: {
    url: specFileUrl,
  },
};
// Import CORS package
var cors = require("cors");

// Router Objects
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var projectsRouter = require("./routes/api/projects");
var projectsRouterV2 = require("./routes/apiv2/projects");
var app = express();

// CORS configuration > no options will enable ALL CORS requests
// any origin can access this API, this is for public APIs
app.use(cors());
// To enable only specific origins, use the following configuration
// var corsOptions = {
//   origin: 'http://example.com'
// };
// app.use(cors(corsOptions));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// Middleware configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Swagger UI setup
// 1) This will serve the Swagger UI on /docs endpoint and load the specified documentation file
// http://localhost:3000/docs
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// 2) Load the generated documentation from code
// http://localhost:3000/docs-code
app.use("/docs-code", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// 3) Load the documentation from a cloud location
// http://localhost:3000/docs-cloud
app.use("/docs-cloud", swaggerUI.serve, swaggerUI.setup(null, optionsForUrl));
// Initialize and Configure Passport
app.use(passport.initialize());
passport.use(
  new BasicStrategy((username, password, done) => {
    // Here you would typically compare the username and password against a database
    // For simplicity, we'll just hardcode the values but store them in .env file and configs
    if (
      username === configs.Credentials.Username &&
      password === configs.Credentials.Password
    ) {
      console.log("Authentication successful");
      return done(null, true);
    } else {
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
  })
);
// Endpoints or Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
// Inject authentication middleware to protect this endpoint
// Session is set to false because we're using Basic Auth in an API call
// This forces user to provide credentials with every requests
// Path-based Versioning
// Default path is v1
app.use(
  "/api/projects",
  passport.authenticate("basic", { session: false }),
  projectsRouter
);
// Define path for v1 following the naming convention for versioning
// /api/version_number/resource
app.use(
  "/api/v1/projects",
  passport.authenticate("basic", { session: false }),
  projectsRouter
);
// Define path for v2
app.use(
  "/api/v2/projects",
  passport.authenticate("basic", { session: false }),
  projectsRouterV2
);

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

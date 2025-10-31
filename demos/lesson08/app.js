var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var projectsAPIRouter = require("./routes/api/projects");

// Import global configurations and mongoose
var configs = require("./config/globals");
var mongoose = require("mongoose");

// Import passport modules
var passport = require("passport");
var BasicStrategy = require("passport-http").BasicStrategy;

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configure passport and the strategy
app.use(passport.initialize());
passport.use(
  // username and password are provided in the Authorization header as a base64 encoded string
  new BasicStrategy((username, password, done) => {
    // Implement your user authentication logic here
    // Hardcoded for now to test base64 strings > admin:password123 = YWRtaW46cGFzc3dvcmQxMjM=
    // Invalid user example > admin:wrongpassword123 = YWRtaW46d3JvbmdwYXNzd29yZDEyMw==
    if (username === "admin" && password === "password123") {
      console.log("Authentication successful for user:", username);
      // Call done(null, user) if authentication is successful
      return done(null, { username: "admin" });
    } else {
      console.log("Authentication failed for user:", username);
      // Call done(null, false) if authentication fails
      return done(null, false);
    }
  })
);

// Routing Table
app.use("/", indexRouter);
app.use("/users", usersRouter);
// Handlers can have more than one middleware function
app.use("/api/projects", 
  passport.authenticate("basic", { session: false}), // always check authentication first
  projectsAPIRouter); // if authenticated, proceed to the route handler
// Connect to MongoDB
mongoose
  .connect(configs.ConnectionStrings.MongoDB)
  .then(() => console.log("Connected successfully!"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

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

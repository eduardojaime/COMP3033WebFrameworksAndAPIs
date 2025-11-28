var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var projectsAPIRouter = require("./routes/api/projects");
var projectsAPIRouterV2 = require("./routes/api/v2/projects");

// Import global configurations and mongoose
var configs = require("./config/globals");
var mongoose = require("mongoose");

// Import passport modules
var passport = require("passport");
var BasicStrategy = require("passport-http").BasicStrategy;

// Import Swagger/YAML modules
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDoc = require("swagger-jsdoc");
// Import CORS to allow cross-origin requests and be able to use the Try It Out feature in Swagger UI
var cors = require("cors");
const project = require("./models/project");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// Enable CORS for all routes
app.use(cors()); 
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configure passport and the strategy
app.use(passport.initialize());
passport.use(
  // username and password are provided in the Authorization header as a base64 encoded string
  new BasicStrategy(async (username, password, done) => {
    // Implement your user authentication logic here
    // // Hardcoded for now to test base64 strings > admin:password123 = YWRtaW46cGFzc3dvcmQxMjM=
    // // Invalid user example > admin:wrongpassword123 = YWRtaW46d3JvbmdwYXNzd29yZDEyMw==
    // if (username === "admin" && password === "password123") {
    //   console.log("Authentication successful for user:", username);
    //   // Call done(null, user) if authentication is successful
    //   return done(null, { username: "admin" });
    // } else {
    //   console.log("Authentication failed for user:", username);
    //   // Call done(null, false) if authentication fails
    //   return done(null, false);
    // }
    // admin@gc.ca:Password123 > YWRtaW5AZ2MuY2E6UGFzc3dvcmQxMjM=
    // admin@gc.ca:Password123! (wrong) > YWRtaW5AZ2MuY2E6UGFzc3dvcmQxMjMh=
    const User = require("./models/user");
    let existingUser = await User.find({ username: username });
    if (existingUser && existingUser.length > 0) {
      let authenticatedUser = await existingUser[0].authenticate(password);
      // user found verify password
      let isPasswordValid = authenticatedUser.user.username === username;
      if (isPasswordValid) {
        console.log("Authentication successful for user:", existingUser[0].username);
        return done(null, existingUser[0]); // authentication successful
      } else {
        return done(null, false); // invalid password
      }
    }
    else {
      return done(null, false); // user not found
    }
  })
);

// API documentation routes
// 1) Load the YAML file from the ./docs folder
const swaggerDoc = YAML.load("./docs/api-specification.yaml");
app.use("/docs/local", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// 2) Generate the Swagger doc dynamically using JSDoc comments
const swaggerJSDocOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project Tracker API",
      version: "1.0.0",
      description: "This API contains endpoints for managing projects for Georgian College students.",
      contact: {
        name: "Eduardo Jaime",
        email: "eduardo.jaime@georgiancollege.ca",
        url: "https://www.georgiancollege.ca/eduardo-jaime"
      }
    },
    servers: [
      { url: "http://localhost:3000/api" },
      { url: "https://dev-projecttracker-ej.onrender.com/api"}
    ]
  },
  apis: [
    "./routes/api/*.js" // files containing annotations as above
  ]
};
const swaggerJSDocSpec = swaggerJSDoc(swaggerJSDocOptions);
app.use("/docs/dynamic", swaggerUI.serve, swaggerUI.setup(swaggerJSDocSpec));

// 3) Serve an externally hosted spec file
const swaggerDocumentUrl = "http://petstore.swagger.io/v2/swagger.json";
const swaggerDocumentURLOptions = {
  swaggerOptions: {
    url: swaggerDocumentUrl
  }
}
app.use("/docs/cloud", swaggerUI.serve, swaggerUI.setup(null, swaggerDocumentURLOptions));

// Routing Table
app.use("/", indexRouter);
app.use("/users", usersRouter);
// Leave legacy routes in place for backward compatibility (existing users may still be using them)
// Handlers can have more than one middleware function
app.use(
  "/api/projects",
  // passport.authenticate("basic", { session: false }), // always check authentication first
  projectsAPIRouter
); // if authenticated, proceed to the route handler
// Add versioned routes accordingly
app.use("/api/v1/projects", projectsAPIRouter); // v1 uses the same as the default /api/projects
// v2 users the new router object defined in a separate file
app.use("/api/v2/projects", projectsAPIRouterV2);
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

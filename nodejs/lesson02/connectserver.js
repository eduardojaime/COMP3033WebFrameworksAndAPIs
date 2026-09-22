// this is a simple web app that implements connect
// connect must be installed via npm > npm install connect
// we'll use the middleware approach to handle requests to different routes

// import connect module
const connect = require("connect"); // third-party module installed via npm
// create app object
const app = connect(); // app represents your web app server
// define middleware functions, they always have 3 parameters: req, res, next
function helloWorld(req, res, next) {
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World!");
}

function goodnightWorld(req, res, next) {
    res.setHeader("Content-Type", "text/plain");
    res.end("Goodnight World!");
}

function notFound(req, res, next) {
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found. Please try /api/helloworld or /api/goodnightworld instead.");
}

// associate middleware functions with routes (paths)
// GET /api/helloworld
app.use("/api/helloworld", helloWorld);
// GET /api/goodnightworld
app.use("/api/goodnightworld", goodnightWorld);
// Generic handlers for all other routes
app.use(notFound); // this applies to any path and is executed if no other route is matched

// start server
app.listen(3000); // standard server port 3000 for node.js apps

// show message in terminal
console.log("Server running at http://localhost:3000/");

// Limitations
// - status codes are always 200 (no error handling)
// - difficult to handle different content types: JSON, XML, HTML, Binary, etc.
// solution is to use Express, a more robust and flexible framework for building web applications and builds on top of connect
// in express we'll reuse the middleware approach described above
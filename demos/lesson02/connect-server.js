// This is a web app built using connect
// Connect implements a middleware pattern (functions)
// We can associate functions to paths
// First, we need to install it using npm
// > npm install connect
// Then import the module
const connect = require("connect");
// Create a connect app object
const app = connect();
// Define middleware functions
function helloHandler(req, res, next) {
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World of APIs!");
}
function goodnightHandler(req, res, next) {
    res.setHeader("Content-Type", "text/plain");
    res.end("Goodnight World of APIs!");
}
// Associate functions to paths
// GET /api/hello
app.use("/api/hello", helloHandler);
app.use("/api/goodnight", goodnightHandler);

// Start the server on a port
app.listen(3000);
console.log("Server running on http://localhost:3000");

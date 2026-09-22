// this is a web app that uses the express framework
// express is built on top of connect and uses the middleware approach in the same way
// but enhances it with more features and flexibility
// content types, and status codes for example
// express must be installed via npm > npm install express
// import express module
const express = require("express"); 
// create app object
const app = express();
// define middleware functions
// middleware approach is the same, but express provides a better way to 
// handle different content types and status codes
function helloWorldJSON(req, res, next) {
    // status codes indicate what happened with the request
    // 200 means all is ok
    // 400 means that the client did something wrong
    // 500 means that the server did something wrong
    res.status(200).json({ message: "Hello World!" });
}

function goodnightWorldTEXT(req, res, next) {
    res.status(200).type("text/plain").send("Goodnight World!");
}

function notFound(req, res, next) {
    // by indicating content type, the browser will know how to render the response
    res.status(404).type("html").send("<h1>Endpoint not found</h1>");
}

// associate middleware functions with routes (paths)
// express allows you to indicate the HTTP method you want to handle
// GET /api/helloworld
app.get("/api/helloworld", helloWorldJSON); // only GET requests and NOT POST, PUT, DELETE, etc.
// GET /api/goodnightworld
app.get("/api/goodnightworld", goodnightWorldTEXT); // only GET requests and NOT POST, PUT, DELETE, etc.
// Generic handlers for all other routes
app.use(notFound); // this applies to any path, any method and is executed if no other route is matched
// start server
app.listen(3000); // standard server port 3000 for node.js apps
// show message in terminal
console.log("Server running at http://localhost:3000/");
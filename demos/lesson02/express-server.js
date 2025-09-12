// This is an Express web app
// It implements the middleware pattern (functions)
// We can associate functions to paths in the same way
// Install it using npm and then import the module
const express = require("express");
// Create an express app object
const app = express();
// Define middleware functions
// Now we can handle different codes and content types
function helloHandlerJson(req, res, next) {
    // Create a JSON object and send it as a response
    let responseObject = {
        message: "Hello World of APIs!",
        date: new Date()
    };
    // .status() sets
    // .json() sets Content-Type to application/json and finalizes the response
    res.status(200).json(responseObject);
}
function goodnightHandlerPlainText(req, res, next) {
    let responseText = "Goodnight World of APIs! The time is " 
    + new Date().toLocaleTimeString();
    // .type() sets Content-Type to text/plain
    // .send() finalizes the response
    res.status(200).type("text/plain").send(responseText);
}
// Associate functions to paths
// Now we can handle specific paths and HTTP methods
app.get("/api/hello", helloHandlerJson);
app.get("/api/goodnight", goodnightHandlerPlainText);

// Start the server on a port
app.listen(3000);
console.log("Server running on http://localhost:3000");
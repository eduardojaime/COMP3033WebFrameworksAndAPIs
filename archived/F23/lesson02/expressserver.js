// import express module
const express = require("express");
// create app object
const app = express();
// configure routes with middleware functions
// GET /hello
app.get("/hello", (req, res, next) => {
    res.status(200).send("Hello World!"); // plain text
});
// /goodbye
app.get("/goodbye", (req, res, next) => {
    res.status(200).json({ "Message" : "Good bye!" });
});
// everything else (instead of cannot GET)
app.use((req, res) => {
    res.status(404).send("Not Found!");
});
// tell the app to listen to a specific port number
app.listen(3000);
// print console message
console.log("App is running on http://localhost:3000")
// import module
const express = require("express");
// create app object
const app = express();
// configure routes with middleware functions (or router objects)
app.use((req, res, next) => {
  // for all endpoints
  console.log(req.url);
  next();
});
app.use("/hello", (req, res, next) => {
  res.status(200).send("Hello world!");
});
app.use("/goodnight", (req, res, next) => {
  res.status(200).json("I'm a JSON file!");
});
app.use((req, res)=> {
    res.status(400).send("Not found!");
})
// listen to a port and show message in terminal
app.listen(3000);
console.log("Server running at http://localhost:3000");

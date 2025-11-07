var express = require("express");
var router = express.Router();
// Import user model
const User = require("../models/user");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// GET /register
router.get("/register", (req, res, next) => {
  res.render("register", { title: "Create a new account to Access the API" }); // render the registration form
});

// POST /register
router.post("/register", async (req, res, next) => {
  // Ideally search if user is already registered first
  let existingUser = await User.find({ username: req.body.username });
  if (existingUser && existingUser.length > 0) {
    res.redirect("/register?success=false"); // user exists, redirect to registration page
  } else {
    // If not registered create a new user
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
      res.redirect("/register?success=true"); // registration successful
    });
  }
});

module.exports = router;

// API Router/Controller object
// import express
const express = require("express");
// create router object
const router = express.Router();
// configure handlers
// GET /api/projects/
router.get("/", function(req, res, next) {
    // simulate going to the DB and retrieving a list of projects
    let projects = [
        { name: "LAB01", dueDate: "2023-09-28" },
        { name: "LAB02", dueDate: "2023-09-30" },
    ];
    // HTTP REST responses include status code and content
    res.status(200).json(projects);
})
// export object
module.exports = router;
// This is the Projects API router module
// Import express and create a router object
const express = require("express");
const router = express.Router();
const Project = require("../../models/project");
// Define routes
// GET /api/projects/ - Retrieve all projects
// Mongoose 8.x is now fully async/await based
router.get("/", async (req, res, next) => {
    let projects = await Project.find();
    res.status(200).json(projects);
});

// Export the router object
module.exports = router;


// Router objects are named in plural form
// All API routers (controllers) are inside of the routes/api folder
// Import Express
const express = require("express");
// Create router object
const router = express.Router();
// Import the model, use ../ to navigate one folder up
const Project = require("../../models/project");
// Configure handlers for the router
// GET /api/projects/ - Read all projects
router.get("/", async (req, res, next) => {
    // Use the model to retrieve all projects in the DB
    let projects = await Project.find();
    // Return projects as JSON response
    res.status(200).json(projects);
});

// Export the router object
module.exports = router;
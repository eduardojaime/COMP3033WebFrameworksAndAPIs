// This is an API router object
// Import express
const express = require('express');
// Create a router object
const router = express.Router();
// Configure handlers for various routes or http methods
// Note: all paths defined here are relative to /api/projects (defined in app.js)
// GET /api/projects/
router.get("/", (req, res, next) => {
    // For demo purposes, return a static list of projects
    var projectList = [
        { id: 1, name: "Project A", description: "Description of Project A" },
        { id: 2, name: "Project B", description: "Description of Project B" },
        { id: 3, name: "Project C", description: "Description of Project C" }
    ]
    // Return JSON response with status code 200 (OK)
    res.status(200).json(projectList);
});

// TODO: Implement CRUD operations for "projects" resource
// GET /api/projects/:id > Gets a specific project by ID
// POST /api/projects/ > Creates a new project with data from request body
// PUT /api/projects/:id > Updates an existing project by ID with data from request body
// DELETE /api/projects/:id > Deletes a project by ID

// export the router object (to configure in app.js)
module.exports = router;

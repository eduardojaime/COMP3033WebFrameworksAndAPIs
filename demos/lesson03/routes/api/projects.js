// This is an API Controller
// The difference is that the API Controller 
// is not rendering a view, it is returning data
var express = require('express');
var router = express.Router();

// TODO: configure endpoints within this route
// GET /api/projects/ - Return a list of all projects
// This path is relative to the path defined in app.js
router.get("/", (req, res, next)=>{
    // mock a list of projects
    let projects = [
        { id: 1, name: "Lab01", dueDate: "2024-09-20" },
        { id: 2, name: "Lab02", dueDate: "2024-10-20" },
        { id: 3, name: "Lab03", dueDate: "2024-11-20" },
    ]
    // Return the list of projects in JSON format with status code 200 OK
    res.status(200).json(projects);
});

// Export to make the object available to app.js
module.exports = router;
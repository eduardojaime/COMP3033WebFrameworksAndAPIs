// Router that handles requests to /api/projects
const express = require('express');
const router = express.Router();
// Import the model
const Project = require('../../models/project');

// Configure your router by adding handlers
// GET handler for /api/projects
// Goal: View a list of projects
router.get('/', (req, res, next) => {
    // the difference between web app and web api is what we return
    // web app >> res.render('view', data);
    // web api returns JSOn
    // res.json('success');
    Project.find((err, projects) => {
        if (err) {
            console.log(err);
            res.json('Error!').status(500);
        }
        else {
            res.json(projects).status(200);
        }
    });
});
// Export this router so we can configure it in app.js
module.exports = router;
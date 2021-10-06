// Router that handles requests to /api/projects
const express = require('express');
const { route } = require('..');
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

// POST /api/projects > Input: JSON object containing information about the project
router.post('/', (req, res, next) => {
    // for testing
    // console.log(req.body);
    // res.json(req.body).status(200);
    // Validation step
    if (!req.body.name) {
        res.json({ 'ValidationError': 'Name is a required field' }).status(400);
    }
    else if (!req.body.course) {
        res.json({ 'ValidationError': 'Course is a required field' }).status(400);
    }
    else {
        Project.create({ 
                name: req.body.name,
                dueDate: req.body.dueDate,
                course: req.body.course
            }, // project info to be added to the db
            (err, newProject) => {
                if (err) {
                    console.log(err);
                    res.json({ 'ErrorMessage': 'Server threw exception' }).status(500);
                }
                else {
                    res.json(newProject).statusCode(200);
                }
            }
        ); // callback function to handle creating a new project
    }
});


// PUT /projects/:_id > Input: JSON object containing information about the project
router.put('/:_id', (req, res, next) => {
    if (!req.body.name) {
        res.json({ 'ValidationError': 'Name is a required field' }).status(400);
    }
    else if (!req.body.course) {
        res.json({ 'ValidationError': 'Course is a required field' }).status(400);
    }
    else {
        Project.findOneAndUpdate(
            { _id: req.params._id }, // filter query
            {
                name: req.body.name,
                dueDate: req.body.dueDate,
                course: req.body.course,
                status: req.body.status
            }, // updated information
            (err, updatedProject) => {
                if (err) {
                    console.log(err);
                    res.json({ 'ErrorMessage': 'Server threw exception' }).statusCode(500);
                }
                else {
                    res.json(updatedProject).statusCode(200);
                }
            }
        );
    }
});

// DELETE /projects/:_id
router.delete('/:_id', (req, res, next) => {
    Project.remove(
        { _id: req.params._id }, // filter query with the id 
        (err) => {
            if (err) {
                console.log(err);
                res.json({ 'ErrorMessage': 'Server threw exception' }).statusCode(500);                
            }
            else {
                res.json({ 'success': 'true' }).status(200);
            }
        }
    );
});

// Export this router so we can configure it in app.js
module.exports = router;
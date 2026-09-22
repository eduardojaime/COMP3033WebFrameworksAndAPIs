const express = require('express');
const router = express.Router();
// Import Project model
const Project = require('../../models/project')

// GET /projects
router.get('/', (req, res, next) => {
    // for now, just enter success
    // res.json('success');
    // Show an unfiltered list of Projects
    Project.find((err, projects) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(projects);
        }
    })
})

// POST /projects
router.post('/', (req, res, next) => {
    // Test first by logging and sending back body
    // console.log(req.body);
    // res.json(req.body);

    // Validate required fields
    if (!req.body.name) {
        res.json({ 'ValidationError': 'Name is a required field' }).status(400);
    }
    else if (!req.body.course) {
        res.json({ 'ValidationError': 'Course is a required field' }).status(400);
    }
    else {
        // s
        Project.create({
            name: req.body.name,
            dueDate: req.body.dueDate,
            course: req.body.course
        }, (err, newProject) => {
            // implement error handling logic
            if (err) {
                console.log(err);
                res.json({ 'ErrorMessage': 'Server threw an exception' }).status(500);
            }
            else {
                res.json(newProject).status(200);
            }
        });
    }
});

// PUT /projects/:_id
router.put('/:_id', (req, res, next) => {
    // Validate required fields
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
            }, // update document
            (err, updatedProject) => {
                if (err) {
                    console.log(err);
                    res.json({ 'ErrorMessage': 'Server threw an exception' }).status(500);
                }
                else {
                    res.json(updatedProject).status(200);
                }
            } // update callback 
        );
    }
});

// DELETE /projects/:_id
router.delete('/:_id', (req, res, next) => {
    Project.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err);
            res.json({ 'ErrorMessage': 'Server threw an exception' }).status(500);
        }
        else {
            res.json({ 'success': 'true' }).status(200);
        }
    });
});

module.exports = router;
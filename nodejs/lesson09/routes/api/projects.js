const express = require('express');
const router = express.Router();
// Import Project model
const Project = require('../../models/project');
// Set a default page size to use in any request handler in this route
const pageSize = 10;

// GET /projects
/**
 * @openapi
 * /:
 *   get:
 *     description: Lists all projects
 *     responses:
 *       200:
 *         description: Returns an unfiltered list of projects
 */
router.get('/', (req, res, next) => {
    // Filter the list via optional URL query string parameters
    // using the req.query object
    // Expected query string ?status=STARTED&course=WebAPI
    
    // create variable for storing page number
    // extract value from query string
    // Expected ?page=1
    let page = req.query.page || 1; // default to page 1 
    // calculate how many records to skip
    // page 1 shows records 1 to 10 so skip 0
    // page 2 shows records 11 to 20 so skip 10
    let skipSize = pageSize * (page - 1);

    // create empty query object
    let query = {};
    // if course is included in request, then add it to query object
    if (req.query.course)
    {
        query.course = req.query.course;
    }
    // if status is included in request, then add it to query object
    if (req.query.status)
    {
        query.status = req.query.status;
    }

    // Modify find() to accept query
    Project.find(
        query, // filter 
        (err, projects) => { // callback
            if (err) {
                console.log(err);
                res.status(500).json({ 'ErrorMessage': 'Server threw an exception' });

            }
            else {
                res.status(200).json(projects);
            }
        })
        // implement pagination
        .sort({ name: 1 }) // to achieve a consisten result sort by name A to Z
        .limit(pageSize) // set page size limit
        .skip(skipSize);
});

// POST /projects
router.post('/', (req, res, next) => {
    // Test first by logging and sending back body
    // console.log(req.body);
    // res.json(req.body);

    // Validate required fields
    if (!req.body.name) {
        res.status(400).json({ 'ValidationError': 'Name is a required field' });
    }
    else if (!req.body.course) {
        res.status(400).json({ 'ValidationError': 'Course is a required field' });
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
                res.status(500).json({ 'ErrorMessage': 'Server threw an exception' });
            }
            else {
                res.status(200).json(newProject);
            }
        });
    }
});

// PUT /projects/:_id
router.put('/:_id', (req, res, next) => {
    // Validate required fields
    if (!req.body.name) {
        res.status(400).json({ 'ValidationError': 'Name is a required field' });
    }
    else if (!req.body.course) {
        res.status(400).json({ 'ValidationError': 'Course is a required field' });
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
                    res.status(500).json({ 'ErrorMessage': 'Server threw an exception' });
                }
                else {
                    res.status(200).json(updatedProject);
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
            res.status(500).json({ 'ErrorMessage': 'Server threw an exception' });
        }
        else {
            res.status(200).json({ 'success': 'true' });
        }
    });
});

module.exports = router;
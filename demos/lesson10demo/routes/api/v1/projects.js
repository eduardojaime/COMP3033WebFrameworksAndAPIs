// Router that handles requests to /api/projects
const express = require('express');
const router = express.Router();
// Import the model
const Project = require('../../../models/project');
// Specify a default page size to use in any request handler in this route
const pagesize = 10;

// Configure your router by adding handlers
// GET handler for /api/projects
// Goal: View a list of projects
/**
 * @openapi
 * /api/Projects:
 *  get:
 *      description: "Lists all projects"
 *      responses:
 *          "200":
 *              description: "Returns an unfiltered list of  projects"
 */
router.get('/', (req, res, next) => {
    // Move the code out of this method and into GetProjectsV1()
    // Create GetProjectsV2() method that returns a message

    // Query parameter-based versioning
    // Expect a single digit number, e.g. ?v=1, ?v=2, ?v=3
    // Handle no value, default version should be 1
    let version = req.query.v || '1'; // extract v from query, if null use 1
    // add custom header to indicate what api version is being used
    res.setHeader('APIVersion', version);
    // Still needs refactoring into code files
    switch (version)
    {
        case '1':
            GetProjectsV1(req, res, next);
            break;
        case '2':
            GetProjectsV2(req, res, next);
            break;
        default:
            res.status(400).json({'ErrorMessage': 'Version name not supported'});
            break;
    }
});

function GetProjectsV1(req, res, next) {
    // the difference between web app and web api is what we return
    // web app >> res.render('view', data);
    // web api returns JSOn
    // res.json('success');

    // Pagination needs a page number (how many records to skip)
    // Mongoose provides limit() and skip() functions
    // Given a page number (from URL) we'll calculate how many records to skip
    let page = req.query.page || 1; // if page is null then use 1 as deault value
    // calculate how many records to skip
    // page 1 shows 1 to 10 so skip 0
    // page 2 shows 11 to 20 so skip 10
    let skipSize = pagesize * (page - 1);

    // Filtering requires a query that we pass to the find function
    // query in mongoDB is a json object
    // create an empty object
    let query = {};
    // validate whether parameters are included in request and add them to query object
    if (req.query.course)
    {
        query.course = req.query.course;
    }
    if (req.query.status)
    {
        query.status = req.query.status;
    }


    // extend the find function: use query, and chain limit, filter, sort methods
    Project.find(
        query, // filter
        (err, projects) => { // callback function
            if (err) {
                console.log(err);
                res.status(500).json('Error!');
            }
            else {
                res.status(200).json(projects);
            }
        })
        // implement pagination here by chaining methods
        .sort({ name: 1 })
        .skip(skipSize)
        .limit(pagesize); // sort by name, jump to the nth position, then take x number of records
}

function GetProjectsV2(req, res, next) {
    res.status(200).json({'message': 'Work in progress!'});
}


// POST /api/projects > Input: JSON object containing information about the project
router.post('/', (req, res, next) => {
    // for testing
    // console.log(req.body);
    // res.json(req.body).status(200);
    // Validation step
    if (!req.body.name) {
        res.status(400).json({ 'ValidationError': 'Name is a required field' });
    }
    else if (!req.body.course) {
        res.status(400).json({ 'ValidationError': 'Course is a required field' });
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
                    res.status(500).json({ 'ErrorMessage': 'Server threw exception' });
                }
                else {
                    res.status(200).json(newProject);
                }
            }
        ); // callback function to handle creating a new project
    }
});


// PUT /api/projects/:_id > Input: JSON object containing information about the project
router.put('/:_id', (req, res, next) => {
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
            }, // updated information
            (err, updatedProject) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ 'ErrorMessage': 'Server threw exception' });
                }
                else {
                    res.status(200).json(updatedProject);
                }
            }
        );
    }
});

// DELETE /api/projects/:_id
router.delete('/:_id', (req, res, next) => {
    Project.remove(
        { _id: req.params._id }, // filter query with the id 
        (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ 'ErrorMessage': 'Server threw exception' });                
            }
            else {
                res.status(200).json({ 'success': 'true' });
            }
        }
    );
});

// Export this router so we can configure it in app.js
module.exports = router;
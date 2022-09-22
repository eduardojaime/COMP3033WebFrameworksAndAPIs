// import the express module
const express = require('express');
// create a router object to configure endpoint handlers
const router = express.Router();

// GET handler
// /api/projects
// use get and pass endpoint path and middleware function as parameters
// this endpoint will show a list of projects in the database
router.get('/', (req, res, next) => {
    // no info is needed from the request object
    // for now let's write a mock list object with mock projects
    let projectList = [
        {
            name: "API Documentation",
            due: "Sep 22 2021"
        },
        {
            name: "API Specification",
            due: "Sep 30 2021"            
        }
    ];
    // send project list as a JSON response with status code 200 OK
    res.status(200).json(projectList);
});

// export the router object
module.exports = router;
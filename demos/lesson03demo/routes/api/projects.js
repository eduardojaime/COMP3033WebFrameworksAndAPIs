// import the express module
const express = require('express');
// create a router object to configure route handlers
const router = express.Router();
// create route handlers based on http verbs: GET, POST, PUT, DELETE
// GET handler for '/api/projects'
router.get('/', (request, response, next) => {
    // call your model and connect to the DB to get a list of projects
    let projectList = [
        {
            name: "Project A",
            dueDate: "22 SEP 2021"
        },
        {
            name: "Project B",
            dueDate: "30 SEP 2021"
        }
    ];
    response.json(projectList).status(200);
});

// export the router object
module.exports = router;
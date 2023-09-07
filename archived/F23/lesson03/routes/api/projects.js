// naming represents /api/projects
// all API related controllers/routers will be inside the /routes/api folder
// import express module
const express = require('express');
// create a router object to configure request handlers
const router = express.Router();
// add request handlers: POST (C) GET (R) PUT (U) DELETE (D)
// request handler = http verb + path (relative) + middleware function
// remember here we are in /api/projects so paths will be relative to this
// GET handler for /api/projects/
router.get('/', (req, res, next) => {
    // simulate getting data from MongoDB in JSON format
    let projects = [
        {
            name: "API Documentation",
            due: "NOV 02, 2022"
        },
        {
            name: "API Specs",
            due: "NOV 16, 2022"
        }
    ];
    // send list of projects back to client
    res.status(200).json(projects);
});

// export router object and register it in app.js
module.exports = router;
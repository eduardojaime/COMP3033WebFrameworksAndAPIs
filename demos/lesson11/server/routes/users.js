var express = require('express');
var router = express.Router();
// Import the service module to fetch project data
var service = require('../../client/nodejs/service');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  // Call the exposed method from the service module
  var projects = await service.getProjects();
  // Return value is in JSON format, so you can send it directly
  console.log("Projects fetched in route: ", projects);
  res.send({
    message: "List of projects",
    data: projects
  });
});

module.exports = router;

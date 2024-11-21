const express = require("express");
const router = express.Router();
// Import Project model
const Project = require("../../models/project");
// Pagination: Define page size, then implement skip and limit in the code
const pageSize = 10; // 10 items per page, this must be fine tuned

// Make all middleware functions async
// This endpoint returns a list so it's candidate for filtering and pagination
// GET /projects?course=ASP.NET&status=IN PROGRESS&page=2
// We'll get the course from the query string
// Comments for API Specification
/**
 * @openapi
 * /:
 *  get:
 *    description: Use to request all projects
 *    responses:
 *    '200':
 *      description: Returns a list of projects
 */
router.get("/", async (req, res, next) => {
  // for now, just enter success
  // res.json('success');
  // Show an unfiltered list of Projects
  // https://mongoosejs.com/docs/api/model.html#Model.find()
  // Extract filter from query string
  let query = {}; // empty object we'll use for filtering in mongodb
  // We are expecting to receive 'course' in the query string
  // Access query string using req.query object
  if (req.query.course) {
    query.course = req.query.course; // append to empty object
  }
  // we can add as many filters as we want
  if (req.query.status) {
    // this value is only added if it appears in the query string
    query.status = req.query.status;
  }
  // Pagination: Implement skip (calculate based on page number and size) and limit
  let page = req.query.page || 1; // default to 1 if not provided
  let skipSize = pageSize * (page - 1);
  // e.g. if page is 1, skip 0 items (10 * 0) show items 1-10
  // e.g. if page is 2, skip 10 items (10 * 1) show items 11-20
  // e.g. if page is 3, skip 20 items (10 * 2) show items 21-30
  // if query is empty, no filter is applied
  // 1 is ascending, -1 is descending
  let projects = await Project.find(query)
    .sort({ dueDate: 1 })
    .limit(pageSize) // only take 10 records
    .skip(skipSize); // 'jump' to the skipSize record number, e.g 11th record or 21st record
  res.status(200).json(projects);
});

// POST /projects
router.post("/", async (req, res, next) => {
  // Test first by logging and sending back body
  // console.log(req.body);
  // res.json(req.body);
  // Validate required fields
  if (!req.body.name) {
    res.status(400).json({ ValidationError: "Name is a required field" });
  } else if (!req.body.course) {
    res.status(400).json({ ValidationError: "Course is a required field" });
  } else {
    let newProject = new Project({
      name: req.body.name,
      dueDate: req.body.dueDate,
      course: req.body.course,
    });
    // Save the new project to the database
    await newProject.save();
    res.status(200).json(newProject);
  }
});

// PUT /projects/:_id
router.put("/:_id", async (req, res, next) => {
  // Validate required fields
  if (!req.body.name) {
    res.json({ ValidationError: "Name is a required field" }).status(400);
  } else if (!req.body.course) {
    res.json({ ValidationError: "Course is a required field" }).status(400);
  } else {
    await Project.findOneAndUpdate(
      { _id: req.params._id }, // filter query
      {
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course,
        status: req.body.status,
      }
    );
    res.status(200).json({ success: "true" });
  }
});

// DELETE /projects/:_id
router.delete("/:_id", async (req, res, next) => {
  await Project.findByIdAndDelete(req.params._id);
  res.status(200).json({ success: "true" });
});

module.exports = router;

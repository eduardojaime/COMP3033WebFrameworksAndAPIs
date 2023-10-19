// Router object for /api/projects endpoint
// Import express
const express = require("express");
// Create router object
const router = express.Router();
// Import Model
const Project = require("../../models/project");
// Pagination - define page size as global variable or env variable
const pageSize = 10; // hardcoded number, but better if it's configurable

// Configure handlers
// Add CRUD functionality by adding handlers for these HTTP methods
// C mapped to POST
router.post("/", async (req, res, next) => {
  if (!req.body.name) {
    res.status(400).json({ validationError: "Name is a required field." });
  } else if (!req.body.course) {
    res.status(400).json({ validationError: "Course is a required field." });
  } else {
    let project = new Project({
      name: req.body.name,
      dueDate: req.body.dueDate,
      course: req.body.course,
    });
    await project.save();
    res.status(201).json(project);
  }
});
// R mapped to GET
router.get("/", async (req, res, next) => {
  // res.status(200).json("success");
  // Pagination
  let page = req.query.page || 1; // if page is null default to 1
  // calculate how many records to skip
  let skipSize = pageSize * (page - 1);
  // Page 1 skips 0
  // Page 2 skips 10
  // and so on

  // retrieve query string for filtering
  // create empty object to represent filter query
  let query = {};
  // http://localhost:3000/api/projects?course=JS FRAMEWORKS
  if (req.query.course) {
    query.course = req.query.course;
  }
  // http://localhost:3000/api/projects?status=TO DO
  if (req.query.status) {
    query.status = req.query.status;
  }

  // mongoose version 7 is async by default
  // so calls to these methods must be contained inside async functions
  // find() and sort() are built-in mongoose module methods
  // find() method takes an optional query parameter that represents fields to filter by
  // skip() method returns only the records from the given starting point
  // limit() method returns only the number of records specified in the parameter
  let projects = await Project.find(query)
    .sort([["dueDate", "descending"]])
    .skip(skipSize) // server side skip()
    .limit(pageSize); 
  res.status(200).json(projects);
});
// U mapped to PUT
router.put("/:_id", async (req, res, next) => {
  if (!req.body.name) {
    res.status(400).json({ validationError: "Name is a required field." });
  } else if (!req.body.course) {
    res.status(400).json({ validationError: "Course is a required field." });
  } else {
    // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
    // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
    let project = await Project.findByIdAndUpdate(
      req.params._id,
      {
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course,
      },
      { new: true } // need this parameter so that mongoose returns the updated version of project
    );
    res.status(200).json(project);
  }
});
// D mapped to DELETE
router.delete("/:_id", async (req, res, next) => {
  await Project.findByIdAndDelete(req.params._id);
  res.status(200).json({ success: "true" });
});
// Export
module.exports = router;

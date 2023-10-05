// Router object for /api/projects endpoint
// Import express
const express = require("express");
// Create router object
const router = express.Router();
// Import Model
const Project = require("../../models/project");
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
  // mongoose version 7 is async by default
  // so calls to these methods must be contained inside async functions
  // find() and sort() are built-in mongoose module methods
  let projects = await Project.find().sort([["dueDate", "descending"]]);
  res.status(200).json(projects);
});
// TODO U mapped to PUT
// TODO D mapped to DELETE
// Export
module.exports = router;

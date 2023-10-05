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
// TODO D mapped to DELETE
// Export
module.exports = router;

// This is the Projects API router module
// Import express and create a router object
const express = require("express");
const router = express.Router();
const Project = require("../../models/project");
// Define routes
// GET /api/projects/ - Retrieve all projects
// Mongoose 8.x is now fully async/await based
router.get("/", async (req, res, next) => {
  let projects = await Project.find();
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
    try {
      const newProject = await Project.create({
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course,
      });
      res.status(200).json(newProject);
    } catch (err) {
      console.log(err);
      res.status(500).json({ ErrorMessage: "Server threw an exception" });
    }
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
    try {
      const updatedProject = {
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course,
        status: req.body.status,
      };
      await Project.findOneAndUpdate(
        { _id: req.params._id }, // filter query
        updatedProject
      );
      res.status(200).json(updatedProject);
    } catch (err) {
      console.log(err);
      res.status(500).json({ ErrorMessage: "Server threw an exception" });
    }
  }
});

// DELETE /projects/:_id
router.delete("/:_id", async (req, res, next) => {
  try {
    await Project.deleteOne({ _id: req.params._id });
    res.status(200).json({ success: "true" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ErrorMessage: "Server threw an exception" });
  }
});

// Export the router object
module.exports = router;

// This is the Projects API router module
// Import express and create a router object
const express = require("express");
const router = express.Router();
const Project = require("../../models/project");
// Define page size for pagination
const PAGE_SIZE = 10;
// Define routes
// GET /api/projects/ - Retrieve all projects
// Mongoose 8.x is now fully async/await based
router.get("/", async (req, res, next) => {
  // Optimize by adding pagination
  // Retrieve page number from query params, default to page 1 if not present
  // https://localhost:3000/api/projects?page=2
  let page = req.query.page || 1;
  // Calculate number of documents to skip based on page number and page size
  // page 1 = skip 0, show records 1 to 10
  // page 2 = skip 10, show records 11 to 20
  // page 3 = skip 20, show records 21 to 30
  let skip = PAGE_SIZE * (page - 1);
  // Use skip() and limit() methods to implement pagination in Mongoose

  // Optimize by adding filtering by course and/or status
  // https://localhost:3000/api/projects?course=JS Frameworks&status=TODO
  // Create empty filter object
  let filter = {};
  // Add properties to filter object if query params are present
  if (req.query.course) {
    filter.course = req.query.course;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }
  // Use filter object in find() method
  let projects = await Project.find(filter)
    .sort({ dueDate: 1 }) // sort by due date ascending
    .limit(PAGE_SIZE) // limit result set to page size
    .skip(skip); // skip number of documents based on page number and page size
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

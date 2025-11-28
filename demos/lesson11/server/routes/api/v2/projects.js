// Router Object v2 - Separate file for version 2 of the /api/projects endpoint
const express = require("express");
const router = express.Router();
const Project = require("../../../models/project");

// Add handlers
router.get("/", async (req, res, next) => {
  let projects = await Project.find().sort({ course: 1 });
  // breaking change
  // we now return an object with a count property and a projects array property
  let result = {
    count: projects.length,
    projects: projects
  }
  res.status(200).json(result);
});

// TODO: Completed projects endpoint (POST, PUT, DELETE)

module.exports = router;
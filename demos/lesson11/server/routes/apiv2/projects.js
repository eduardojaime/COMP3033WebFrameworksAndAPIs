const express = require("express");
const router = express.Router();
const Project = require("../../models/project");

// v2 does not offer filters and pagination yet
router.get("/", async (req, res, next) => {
  let projects = await Project.find();
  res.status(200).json(projects);
});
module.exports = router;

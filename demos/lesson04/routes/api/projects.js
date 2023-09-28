// Router object for /api/projects endpoint
// Import express
const express = require("express");
// Create router object
const router = express.Router();
// Configure handlers
// Add CRUD functionality by adding handlers for these HTTP methods
// TODO C mapped to POST
// R mapped to GET
router.get("/", (req, res, next) => {
  res.status(200).json("success");
});
// TODO U mapped to PUT
// TODO D mapped to DELETE
// Export
module.exports = router;

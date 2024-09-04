// Import Mongoose
const mongoose = require("mongoose");
// Create schema definition object > JSON format
const schemaDefObj = {
  name: {
    type: String,
    require: true,
  },
  dueDate: {
    type: Date,
  },
  course: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    default: "TO DO", // TO DO, IN PROGRESS, DONE
  },
};
// Create mongoose schema
const projectSchema = new mongoose.Schema(schemaDefObj);
// Export mongoose model
module.exports = mongoose.model("Project", projectSchema);
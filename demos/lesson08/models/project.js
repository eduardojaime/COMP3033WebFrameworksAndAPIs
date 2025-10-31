// Naming convention: models are singular, routers are plural
// Import mongoose
const mongoose = require("mongoose");
// Define data schema object in JSON
const dataSchemaObject = {
  name: { type: String, required: true },
  dueDate: { type: Date },
  course: { type: String, required: true },
  status: {
    type: String,
    enum: ["TODO", "IN PROGRESS", "DONE"],
    default: "TODO",
  },
};
// Create mongoose schema
let mongooseSchema = new mongoose.Schema(dataSchemaObject);
// Create and export mongoose model
module.exports = mongoose.model("Project", mongooseSchema);

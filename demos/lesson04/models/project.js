// Model file names are in singular form
// This file represents a project in my database
// Import mongoose
const mongoose = require(mongoose);
// Create a schema definition object
const schemaDefObj = {
    name: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
    },
    course: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "TO DO"
    }
};
// Create a new mongoose schema using the definition object
let mongooseSchema = new mongoose.Schema(schemaDefObj);
// Create a model using the schema and export it
module.exports = mongoose.model("Project", mongooseSchema);
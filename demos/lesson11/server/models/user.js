const mongoose = require("mongoose");
const plm = require("passport-local-mongoose"); // contains advanced password management features
const dataSchemaObject = {
    username: { type: String },
    password: { type: String }
};
let mongooseSchema = new mongoose.Schema(dataSchemaObject);
// inject plm functionality to handle password encryption out-of-the-box
mongooseSchema.plugin(plm);
module.exports = mongoose.model("User", mongooseSchema);
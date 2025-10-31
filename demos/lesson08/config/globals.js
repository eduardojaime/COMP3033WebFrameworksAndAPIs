require("dotenv").config();
// Global configurations object
const configurations = {
    ConnectionStrings: {
        MongoDB: process.env.CONNECTION_STRINGS_MONGODB
    }
};

// Export the configurations object for use in other modules
module.exports = configurations;
require("dotenv").config(); // loads .env file into process.env

const globals = {
    "ConnectionStrings": {
        // name must match key in .env file
        "MongoDB": process.env.CONNECTION_STRING_MONGODB,
    },
    "Credentials": {
        "Username": process.env.AUTH_USERNAME,
        "Password": process.env.AUTH_PASSWORD
    }
}
// Make the object available to the rest of the app
module.exports = globals;
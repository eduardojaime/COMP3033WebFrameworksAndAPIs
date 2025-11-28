// Import an HTTP client library
// Options include 'axios', 'node-fetch', or the built-in 'http'/'https' modules
const http = require('http');
// Define the base URL for the API
const BASE_URL = 'http://localhost:3000/api/projects';
// Call the get method from the HTTP client to fetch data from the API
async function getProjects() {
    return new Promise((resolve, reject) => {
        http.get(BASE_URL, (response) => {
            // check if response is successful
            if (response.statusCode === 200) {
                console.log("Request successful: ", response.statusCode);
            }
            // declare variable to store data received
            let projectData = '';
            // concatenate data chunks as they are received from server
            response.on("data", (chunk) => {
                projectData += chunk;
            });
            // log the complete data once fully received
            // when all data has been received it emits 'end' event
            response.on("end", () => {
                // console.log("Received project data: \n", JSON.parse(projectData));
                resolve(JSON.parse(projectData));
            });

            // handle errors
            response.on("error", (err) => {
                // console.error("Error fetching project data: ", err.message);
                reject(err);
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
}
// export as module to be used as a service layer
module.exports = { getProjects };
// getProjects();
// Console app that will consume an API via http client
console.log("Hello Http Client!");
// Import the http module
const http = require("http");
// Define the URL of the API
const url = "http://localhost:3000/api/projects?course=ASP.NET&status=IN%20PROGRESS";
// Call GET method in http module
// Three parameters: url, options, callback function
http.get(url, { 'auth': 'admin:MySecretPassword123' }, (response) => {
    // Variable to store the response
    let data = "";
    // When data is received
    // It will be received in chunks
    response.on("data", (chunk) => {
        data += chunk; // append each chunk to the data variable
    });
    // event listener to end the response
    response.on("end", () => {
        console.log("Finished Retrieving Data");
        console.log(JSON.parse(data)); // parse the data to JSON
    });
    // event listener for error
    response.on("error", (error) => {
        console.log("An error occurred: ", error);
    });
});
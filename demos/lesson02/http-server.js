// This is a basic HTTP server using Node.js 'http' module (built-in)
// Import the http module
const http = require("http");
// Call the createServer method to create an HTTP server
// We also need to provide a request handler function (middleware/callback) to tell the server what to do
// Call the listen method to start the server and listen on a specific port (method chaining)
http
  .createServer((req, res) => {
    // Set the response HTTP header with HTTP status and content type
    res.writeHead(200, { "content-type": "text/plain" });
    // Write content in the response body
    res.write("Hello World of APIs!");
    // End the response processing pipeline and send the response to the client
    res.end();
  })
  .listen(3000);
// Output success message
console.log("Server is listening at http://localhost:3000");

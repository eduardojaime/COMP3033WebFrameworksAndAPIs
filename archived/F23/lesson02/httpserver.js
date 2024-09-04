// import module
const http = require("http");
// configure server with callback function
http
  .createServer((request, response) => {
    response.writeHead(200, { "content-type": "text/plain" });
    response.write("Hello World!");
    response.end();
  })
  .listen(3000); // call listen() to start listening to a specific port
// display message in terminal so we know it all worked
console.log("Web app is running on http://localhost:3000");

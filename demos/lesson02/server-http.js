// simple web app that responds to requests with a message
// using built-in http module
// import http module
const http = require("http"); // out-of-the-box module
// configure server to listen on port 3000
// pass a callback function to tell the server how to respond to a request
http.createServer((req, res)=>{
    // for routing we would need an if-else to check for the req.url and then respond accordingly
    // this function is executed only when a request is received
    // set response headers: 200 means all is ok and content type indicates the type of content I'm sending back
    res.writeHead(200, {"Content-Type": "text/plain"});
    // set content
    res.write("Hello World");
    // end response (to send it)
    res.end();
}).listen(3000); 
// display message in the terminal to know the server is running
console.log("Server running at http://localhost:3000/");

// Limitations
// - not suitable for complex applications (for now any request receives same response)
// - not suitable for production (no security, no error handling, no scalability)
// - not suitable for real-world applications (no routing, no middleware, no templating)
// solution is to use an alternative like Connect or Express that provides a more robust 
// and flexible framework for building web applications
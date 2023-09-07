// import module
const http = require('http');
// configure server: createServer().listen() method chain
// callback function accepts req and res parameters
http.createServer((req, res) => {
    // modify res object and call end() when ready to send response back to caller/client
    // set response headers
    res.writeHead(200, { 'content-type': 'text-plain'});
    // set response content
    res.write('Hello world!');
    // end response
    res.end();
}).listen(3000);

// display message in Terminal
console.log('Web app running on http://localhost:3000');

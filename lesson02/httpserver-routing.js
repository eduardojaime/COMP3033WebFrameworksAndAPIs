// import module
const http = require('http');
// configure server: createServer().listen() method chain
// callback function accepts req and res parameters
http.createServer((req, res) => {
    // if you wanted to do routing, then you'd need to write everything from scratch
    console.log(req.url);
    res.writeHead(200, { 'content-type': 'text-plain' });
    if (req.url == '/hello') {
        res.write('Hello!');
    }
    else {
        res.write('Invalid endpoint!');
    }
    res.end();
}).listen(3000);

// display message in Terminal
console.log('Web app running on http://localhost:3000');

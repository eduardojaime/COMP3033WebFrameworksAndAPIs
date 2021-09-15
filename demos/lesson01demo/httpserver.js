// 1) Import the http module
const http = require('http');

// 2) Create a web server application to handle requests
http.createServer((req, res) => {
    console.log(req.url);
    // routing
    let endpoint = req.url;
    if (endpoint == '/') {
        // req is the request object sent by the client
        // it contains all the info needed for the server to process it
        // Send info to the client in the response object
        // Tell the client the request was successful and response
        // is plain text
        res.writeHead(200, { 'content-type': 'text-plain' });
        // provide some content for the client to view
        res.write('Hello World! (from HTTP module)');
        // seal and send it
        res.end();
    }
    else if (endpoint == '/menuitems') {
        handleMenuItems(req, res); // middleware 
    }

}).listen(3000); // 3) Configure the app to listen to a specific port

// 4) Show some message to the console to know everything went well
console.log('Web app is running on http://localhost:3000');

// Option B
// http.createServer(function (req, res) {
// });
function handleMenuItems(req,res) {
    res.writeHead(200, { 'content-type': 'text-plain' });
    res.write('Here are my menu options');
    res.end();
}




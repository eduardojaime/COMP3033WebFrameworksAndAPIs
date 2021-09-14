const http = require('http');

http.createServer(handleAnyRequest).listen(3000);

function handleAnyRequest(request, response) {
    response.writeHead(200, {'content-type': 'text-plain'});
    response.write('Hello World!');
    response.end();
}

console.log('Web app running on http://localhost:3000');
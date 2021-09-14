const http = require('http');

http.createServer((request, response) => {
    response.writeHead(200, {'content-type': 'text-plain'});
    response.write('Hello World!');
    response.end();
}).listen(3000);

console.log('Web app running on http://localhost:3000');
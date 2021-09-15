// 1) Import the connect module
const connect = require('connect');

// 2) Create and configure app object
const app = connect();
app.listen(3000);

// 3) Show a message to the console
console.log('Server is running on http://localhost:3000');

// 4) Create middleware functions
function handleHelloWorld(request, response, next) {
    response.setHeader('content-type', 'text-plain');
    response.end('Hello world!');
}

// 5) Register these to endpoints
app.use(handleHelloWorld); // << what endpoint is this? any request

// handle http://localhost:3000/hello
// handle http://localhost:3000/goodbye
// handle http://localhost:3000/ (root)
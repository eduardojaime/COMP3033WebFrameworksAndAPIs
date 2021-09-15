// 1) Import the connect module
const connect = require('connect');

// 2) Create and configure app object
const app = connect();
app.listen(3000);

// 3) Show a message to the console
console.log('Server is running on http://localhost:3000');

// 4) Create middleware functions
function logger(request, response, next) {
    console.log(request.method, request.url);
    next();
}

function handleHelloWorld(request, response, next) {
    response.setHeader('content-type', 'text-plain');
    response.end('Hello world!');
}

function handleGoodbyeWorld(request, response, next) {
    response.setHeader('content-type', 'text-plain');
    response.end('Goodbye World!')
}

function handleNotAvailable(request, response, next) {
    response.setHeader('content-type', 'text-plain');
    response.end('There\'s nothing here');
}

// 5) Register these to endpoints
// app.use(handleHelloWorld); // << what endpoint is this? any request
app.use(logger); // << will be executed with all requests
// handle http://localhost:3000/hello
app.use('/hello', handleHelloWorld); // << executed only for requests to /hello
// handle http://localhost:3000/goodbye
app.use('/goodbye', handleGoodbyeWorld); // < executed only for requests to /goodbye
// handle http://localhost:3000/ (root and any other endpoint that's not handled)
app.use(handleNotAvailable); // << executed only for requests that are not handled by hello or goodbye
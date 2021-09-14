const connect = require('connect');
const app = connect();

app.listen(3000);

console.log('Server running on http://localhost:3000');

// create middlewares to register
function helloWorld(request, response, next) {
    response.setHeader('Content-Type', 'text-plain');
    response.end('Hello World!');
}

function logger(request, response, next) {
    console.log(request.method, request.url);
    // Important to call next
    next();
}

// register the middleware, these will be executed in the order that they are registered
// app.use(logger);
// app.use(helloWorld);

//Next step is to create different middleware functions for different endpoints
function goodbyeWorld(request, response, next) {
    response.setHeader('Content-Type', 'text-plain');
    response.end('Goodbye World!');
}

// You can also register a middleware to a particular endpoint
// execution order: logger > helloworld > goodbyeworld
// execution will stop until one of the functions for the endpoint calls end()
app.use('/hello', helloWorld);
app.use('/goodbye', goodbyeWorld);
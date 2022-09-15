// import the module
const connect = require('connect'); // need to install via npm first
// create an app object
const app = connect();
// predefine middleware functions
function logging(req, res, next) { // logging is meant to be used with ALL requests
    console.log(req.url);
    next(); // call the next one in the pipeline that matches the request 
}
function helloWorld(req, res, next) {
    res.setHeader('Content-Type', 'text-plain');
    res.end('Hello World!');
}
function goodnightWorld(req, res, next) {
    res.setHeader('Content-Type','text-plain');
    res.end('Goodnight World!');
}
function NotFound(req,res,next) {
    res.setHeader('Content-Type','text-plain');
    res.end('Endpoint not found. Please try /hello or /goodnight');
}
// associate middleware functions to endpoints
app.use(logging); // associate hello world to all requests regardless of endpoint
app.use('/hello', helloWorld);
app.use('/goodnight', goodnightWorld); // respond with goodnight world to requests to /goodnight
app.use(NotFound); // if no middleware matches the request then I'll send a helpful message to my users

// configure app to listen to a port and print message to console to confirm everything is working
app.listen(3000);
console.log('Server running on http://localhost:3000');
// test > middleware execution is determined by the order in which these are registered
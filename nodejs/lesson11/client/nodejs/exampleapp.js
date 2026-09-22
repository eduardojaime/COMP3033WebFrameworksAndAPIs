console.log('Hello World!');

// Tutorial from: https://www.digitalocean.com/community/tutorials/how-to-create-an-http-client-with-core-http-in-node-js
// When consuming APIs from a backend, we need to use some sort of WebClient object
// Different programming languages and platforms will have different options
// Node has the built-in http module
const http = require('http');

// instead of creating a server, this time we'll consume a service
const url = 'http://localhost:3000/api/projects?status=DONE';

// get method accepts three parameters: url, options (auth headers), and callback function
let request = http.get(url, { 'auth': 'admin:default' }, res => {
    if (res.statusCode !== 200) {
        console.log(`Status: ${res.statusCode}`);
        res.resume();
        return;
    }

    // create variable to store data received
    let data = '';

    // add an event listener to receive the stream of data in 'chunks'
    // append streamed data to data object
    res.on('data', (chunk) => {
        data += chunk;
    });

    // when all data is received node emits a close event
    // parse JSON stored in data and log the result in the console
    res.on('close', () => {
        console.log('Retrieved all data');
        console.log(JSON.parse(data));
    });

    // when a request is made but cannot be sent, the request object emits an error event
    // if this is not handled the app will crash
    request.on('error', (err) => {
        console.error(`Encountered an error trying to make a request: ${err.message}`);
    });
});

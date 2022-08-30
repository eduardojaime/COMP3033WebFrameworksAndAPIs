console.log('Hello World!');

// Tutorial from: https://www.digitalocean.com/community/tutorials/how-to-create-an-http-client-with-core-http-in-node-js
// When consuming APIs from backend components, we need to use some sort of WebClient class
// Node has the built-in http module
const http = require('http');
// Url to the endpoint
const url = 'http://localhost:3000/api/projects?status=DONE';

// use the 'get' method to make a request
// it takes three parameters: url, options (auth header), callback function
let request = http.get(
    url,
    { 'auth': 'admin:default' },
    res => {
        // handle erroneous status codes (different than 200)
        if (res.statusCode !== 200) {
            // show message and exit
            console.log(`Status:${res.statusCode} Message:${res.statusMessage}`);
            res.resume();
            return;
        }
        // store data received in a variable
        let data = '';
        res.on('data', (chunk) => {
            data += chunk; // append each chunk received to the data object
        });
        // handle close event >> node emits the close event when all data is received
        res.on('close', () => {
            console.log('Retrieved all data');
            console.log(JSON.parse(data));
        })
        // handle error event >> node emits the error event when request was made but couldn't be sent
        res.on('error', (err) => {
            console.log(`Encountered an error: ${err}`);
        });

    }
);
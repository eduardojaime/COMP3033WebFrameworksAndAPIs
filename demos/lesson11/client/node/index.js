// This is a console application that implements Axios
// https://www.npmjs.com/package/axios
console.log("Hello HttpClient!");
// Import Axios
const axios = require("axios");
// await calls can only exist inside async functions
async function Main() {
  // Create Axios Options Object
  const options = {
    url: "http://localhost:3000/api/projects?course=PROGRAMMING%20FUNDAMENTALS&status=DONE",
    method: "GET",
    headers: {
      Authorization: "basic YWRtaW46ZGVmYXVsdA=",
    },
    data: {}, // data to pass to the API if any, in this case nothing is required
  };
  // Call Axios Request method and store response in a variable
  let response = await axios.request(options);
  // Print out JSON list
  console.log(response.data); // access data attribute which contains only the info sent from the server
}

Main(); // to be able to use await
# Instructions

### Part 1 Setting up projects and enabling CORS in our API to allow public clients

- Copy over folder containing lesson10 demo files
    - Rename this folder to lesson11
    - Create folders inside this one with this structure:
        - lesson11
            - server
            - client
                - html+jquery
                - nodejs
    - Cut all demo code files and paste them in lesson11/server
- Open the lesson11 folder using Visual Studio Code
    - You should be able to see all inner folders listed in the tree view on your left
- Open a terminal and navigate to server folder
    - Run npm i cors
- In app.js
    - Import the cors module into a new object
    - Call app.use() to register the cors() middleware function
- Run nodemon
- Open insomnia REST client and test your API
    - All current tests should be successful

### Part 2 Consuming an API with HTML and jQuery (frontend)

- In /client/html+jquery
    - Create a new file called index.html
    - Add minimal html tags:
        - Html
            - Head
                - Meta with charset value
            - Body
    - In the body section
        - Add a table element
            - Add a thead element with three headers: project, status, and due date
            - Add a tbody element with id="projectListing"
    - In the head section
        - Add a reference to jquery-3.6.0.min.js from the CDN link
            - https://code.jquery.com/ 
        - Add a script tag
            - Create a variable to hold the endpoint URL and the authentication token
                - It's not recommended to have token values hardcoded on the page, but we'll do it this way for simplicity to demonstrate how jQuery consumes services
            -  Use the document.ready() jQuery function to make the request when page loads
                - Add a basic authentication header to the request using $.ajaxSetup function
                - Call $.get to make a request to the endpoint
                    - This function takes a url, and a callback function with two parameters: data and status
                        - Pass the variable holding the url as the first parameter
                        - As a second parameter, write an anonymous function
                            - Print the content of data to the console (browser console)
                            - Show the request status in an alert
                        - Notice how data comes as an array of object
                        - Access the first element in the array as you would normally do and store it in a variable
                        - Print the object in an alert using JSON.stringify()
                        - Use the forEach() function of the data object to access each element individually
                            - forEach accepts an anonymous function with one parameter: elem
                            - Get the tbody element by id
                            - Generate the html markup to be appended, this is the new row containing information about the element
                            - Append the generated row markup to the tbody object
    - Make sure your server application is running in the terminal
    - Right click on index.html and select Reveal in File Explorer
        - Double click on the index.html file to open on a browser
        - Table should be populated with data from the API
        
### Part 3 Consuming an API with Node.js (backend)

- In /client/nodejs
    - Create a new file called exampleapp.js
    - Call console.log() to print a Hello World message
    - Right click on exampleapp.js and select Open in Integrated Terminal
        - Run the following command to verify: node exampleapp
        - Hello World message should be displayed in the terminal
    -  Import the http module
    - Create a constant url object to hold the endpoint url
    - Create a request object and initialize it by calling http.get()
        - Get() takes three parameters: url, options, and callback function
            - Pass the url constant as the first parameters
            - The second parameter must be an object in JSON format
                - Set the auth property to admin:default
            - Define the anonymous callback function with a single parameter called res
                - Verify the statusCode property value in res
                    - Print to console and return if different than 200
                - Create a variable named data to hold received data
                - Add an event listener for the 'data' event
                    - Node will stream data in chunks so every chunk must be appended to the data object
                - Add an event listener for the 'close' event
                    - This is triggered when all data is received
                    - Show data in console
                    - Print confirmation message
                - Add an event listener for the 'error' event
                    - This is triggered if request is made but cannot be sent
                    - If not handled the app will crash
    - Make sure your server app is running in the terminal
    - Right click on exampleapp.js and select Open in Integrated Terminal
        - Run the following command to verify: node exampleapp
        - Verify output messages
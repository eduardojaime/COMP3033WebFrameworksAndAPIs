# Instructions

### Useful Commands

Command | Description
-|-
node -v   | prints the currently installed version of node
npm -v | prints the currently installed version of npm
node \<file> | Runs the specified file
npm i \<package> | Installs the specified NPM package locally

### Pre-requirements

- VS Code > https://code.visualstudio.com/
- Install the following VS Code Extensions
    - MongoDB for VS Code by MongoDB
    - Code Spell Checker by Street Side Software
    - Prettier - Code Formatter by Prettier
    - HTML CSS Support by ecmel
    - IntelliCode by Microsoft
    - OpenAPI (Swagger) Editor BY 42Crunch
    - openapi-lint by mermade
    - Swagger Viewer by Arjun G
    - YAML by Red Hat
    - Todo Tree by Gruntfuggly

### Part 1 Installing Node.js and NPM

- Open a browser, and navigate to https://nodejs.org
    - Choose from one of the two versions to download the installer:
        - LTS (long term support) is the version you would use for production applications
        - Current includes features that might not yet be fully supported but I'd recommend using this one for learning
    - Once the download is complete, run the installer, and complete the step-by-step wizard
- To verify that you have successfully installed node and npm, open a Command Prompt or a Terminal (from Visual Studio Code) and run the following commands:
    - node -v
    - npm -v
    - Both commands should show a version number
- Create a new folder to contain your code using the Command Prompt or Windows Explorer
    - Open the folder in Visual Studio Code
    - Create a new file called helloworld.js
        - Call console.log('hello world') to print a message to the console
    - Open a new Terminal and run the following command:
        - node helloworld
        - Message should appear in the terminal

### Part 2 Creating a sample web application using the http module

- Create a new file called httpserver.js
    - Import the http module
    - Call the createServer() method to create a web server object
        - This method accepts an annonymous function that receives two parameters:
            - request, which is the object sent from the client
            - response, which is the object the server will return
        - Inside this function:
            - Add a header to the response object by calling writeHead()
                - This method accepts two parameter:
                    - Status code, set to 200 to indicate success
                    - A JSON object containing a list of key-value pairs to configure the response:
                        - Set content-type to plain-text
            - Once you are done, make sure to close the response object by calling the end() method
    - Call the listen() method to specify the port that the server will listen to
    - Lastly, call a console.log() to print a message indicating the server is running
        - Set port to 3000 which is the default value
    - Run the following command from the terminal:
        - node httpserver
        - Success message should appear
    - Open a browser and navigate to http://localhost:3000
        - Verify the hello world message appears on the page
    - Press CTRL + C in the terminal to stop the application
- Focus Question: How could we achieve modularity in our application? That is, creating functions and handling requests to different endpoints accordingly?
    - You could create a function per endpoint, and extract the path to the endpoint using req.url and a series of if-else statements
    - Is this approach maintainable and readable?

### Part 3 Installing the Connect module to extend our app's ability to handle requests

- Install the connect module using the Terminal by running the following command
    - npm i connect
    - To verify, look for the newly created Package.json file
- Create a new file called connectserver.js
    - Import the connect module
    - Create an app object by calling the connect() method
    - Listen to a port
    - Call console.log() to print a success message to the console
- Run your application from the terminal by executing:
    - node connectserver
    - A page showing 'Cannot GET /' should appear
- Now let's add some middleware to our application:
    - Create a new function called helloWorld that accepts a request, response, and next parameters
        - Set content type to text-plan by calling response.setHeader();
        - Call response.end('hello world') to pass some text to the response
    - Call app.use() to register this new function
    - Add a logger() function that accepts a request, response, and next parameters
        - Print request.url and request.method values to the console
        - Call next() to invoke the next middleware function in the pipeline
    - Call app.use() to register this new function but do so before app.use(helloWorld);
- Now let's register a middleware to a specific endpoint
    - Create a new function called goodbyeWorld that accepts a request, response, and next parameters
        - Set content type to text-plan by calling response.setHeader();
        - Call response.end('goodbye world') to pass some text to the response
- Use app.use('path', middleware) to bind the hello and goodbye world functions to a particular endpoint
    - app.use('/hello', helloWorld);
    - app.use('/goodbye', goodbyeWorld);
- Run your application from the terminal by executing:
    - node connectserver
    - Navigate to http://localhost:3000/hello
        - Hello World message should appear
    - Navigate to http://localhost:3000/goodbye
        - Goodbye World message should appear

### Part 4 Installing the Express module to extend the Connect module approach

- Install the express module using the Terminal by running the following command
    - npm i express
    - To verify, look in the Package.json file
- Create a new file called expressserver.js
    - Import the express module
    - Create an app object by calling the express() method
    - Listen to a port
    - Call console.log() to print a success message to the console
- Run your application from the terminal by executing:
    - node expressserver
    - A page showing 'Cannot GET /' should appear
- Now let's add some middleware to our application:
    - Use app.use('path', middleware) to bind middleware functions to a particular endpoint
        - app.use('/hello', middleware);
            - Send a hello world message
        - app.use('/goodbye', middleware);
            - Send a goodbye world message
- Run your application from the terminal by executing:
    - node expressserver
    - Navigate to http://localhost:3000/hello
        - Hello World message should appear
    - Navigate to http://localhost:3000/goodbye
        - Goodbye World message should appear




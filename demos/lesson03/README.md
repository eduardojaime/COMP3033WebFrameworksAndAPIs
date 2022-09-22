# Instructions

### Part 1 Create a Project Tracker Application

- Open the command prompt and install the following NPM packages
    - Express Generator tool:
        - npm i -g express-generator
    - Nodemon:
        - npm i -g nodemon
- Use Express Generator to create a new app using scaffolding
    - Create a new folder and open it with your preferred IDE
    - Open a terminal and run command:
        - express --view=hbs
            - --view=hbs specifies the view engine which is Handlebars in this case
            - since this is an API project you may use any view engine of your preference 
    - Install packages via 
        - npm i
    - Run via 
        - npm start or nodemon
    - Remove unused routes:
        - /routes/users.js
        - app.js delete:
            - var usersRouter = require('./routes/users');
            - app.use('/users', usersRouter);
    - Add Projects route
        - In Routes:
            - Create a new folder called API
            - In routes/api
                - Create projects.js
                - Import express
                - Create router object
                - Add get middleware 
                    - Create a mock JSON object
                    - Use the response object to render JSON object
                - Export router module
        - In app.js:
            - Create router object
            - Use router object on '/api/projects' endpoint
    - Make sure your application is running and navigate to http://localhost:3000/api/projects/ on a browser

### Part 2 Test your endpoint with Insomnia REST client

- In the Visual Studio Code terminal
    - Make sure your application is running
    - If not then run it using nodemon
- Download and install Insomnia REST client from https://insomnia.rest/download
- Open Insomnia
    - Create a new Collection
    - Create a new folder called Web Frameworks and APIs
        - This will be used as a container for all the requests you'll create in these demos
    - Click on "Create a new request"
    - Select GET method and name the request as "Project List"
    - Enter http://localhost:3000/api/projects/ as the endpoint
    - Click Send
    - On the output window on your right, verify:
        - Status code should be 200
        - Response body contains a JSON object that represents a list of projects


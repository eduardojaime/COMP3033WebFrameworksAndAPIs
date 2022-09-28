# Instructions

### Part 1 Creating and configuring a Mongo database
- Go to Mongo Cloud Atlas and Sign up for an account
    - Install MongoDB Atlas
    - Create cluster
    - Set up access via Security > DB Access
    - Set up IP Whitelist > Security > Network Access
        - Add 0.0.0.0/0 to allow all IP addresses
    - Check cluster is running
    - Check collections
        - List of collections must be empty
    - Click on Connect, select Compass to get the connection string needed for the project
    - Open Compass and connect
        - Create a new DB
        - Set default collection as Projects

### Part 2 Creating a Project Tracker Application
- Use Express Generator to create a new app using scaffolding
    - Create a new folder using the command line
    - Run command:
        - express --view=hbs
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
            - Create a new folder called api
            - Inside of this folder create a file called projects.js
                ® Import express
                ® Create router object
                ® Add a GET handler that returns a hardcoded JSON response
                ® Export router module
        - In app.js:
            - Create router object
            - Use router object on '/projects' endpoint
            
### Part 3 Connecting to MongoDB
- Search for mongoose on https://npmjs.com
- Install mongoose package
    - npm i mongoose
- Create a global configuration file
    - Create a new folder in the root called 'config'
    - Create globals.js
    - Create a JSON object called configuration than will contain key value pairs
        - Go back to mongodb.com
        - Navigate to Clusters > Connect > Connect from your App to view the connetion string
        - Add new key called db with value set as your Mongo DB connection string
        - Remember to replace <password> with your real password
    - Export this object
- In app.js
    - Import mongoose into the project and create an object
    - After the .use() calls to register controllers
        - Create the connection string variable
        - Call the connect() method of the mongoose object:
            - Pass connection string
            - Pass options as parameters to avoid warnings
            - Modify username or password to show error message
- Run the nodemon command in the console
    - If everything is correctly set up you should see 'Connected successfully!' message
    - Try hitting the localhost:3000/projects endpoint with the REST client

### Part 4 Creating a Model and calling it from the Router object
- Create a folder in the root called models
- Create a file called project.js file inside of this folder
    - Import mongoose into the  file and create object
    - Define an schema for this project object using the mapping notation
    - Create schema object by calling new mongoose(schemaDefinition)
        - Point out: type, required, default
    - Create a model object by calling mongoose.model(schhemaObj)
    - Export model
- In routes/api/projects.js
    - Import model in project
    - Modify GET handler for '/'
    - Remove hardcoded object
    - Call Project.find()
        - Callback function returns error and a lists of project object
        - Use if else to handle error
        - Else > pass data inside res.json
- Try it out using Insomnia REST client
    - It should return an empty list for now
    - We will add some data next week
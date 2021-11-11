# Instructions

### Part 1 Install required packages

- Visit and review each package's documentation page:
    - https://www.npmjs.com/package/passport
    - https://www.npmjs.com/package/passport-http
- Open a terminal and execute the following commands
    - npm i passport
    - npm i passport-http
- Open package.json and verify packages were added to the dependencies list

### Part 2 Implement Basic Authentication Strategy

- In app.js
    - Import the passport package at the top of your file
    - Create a new const called BasicStragety and use the passport-http package to initialize it
        - Use the BasicStrategy attribute
    - Scroll down past the app.use() calls
    - Initialize passport by calling app.use(passport.initialize());
    - Call passport.use() and define a new BasicStrategy
        - The constructor method accepts a callback function with three parameters
            - username > username provided in the request
            - password > password provided in the request
            - done > function called when authentication is done, it can result in true or false
        - In the callback function
            - For now, let's hardcode username set to 'admin' and password set to 'default'
            - Verify that username:password combination is valid
                - If it is, then return done(null, username) which means authentication was successful
                - Else, return done(null, false) which means authentication failed
                - Add a log message to each case
    - After the strategy was defined, passport.authenticate() can be called as a middleware function
        - Look for app.use('/api/projects', projectsRouter => { …. });
        - Call passport.authenticate() between the endpoint definition and the routerObject
        - This method takes two parameters:
            - 'basic' which specifies the strategy used
            - A JSON object with options
            - Session is set to false because we don't want to store cookies or anything session related between requests
- Open Insomnia REST client
    - Verify the requests already created
        - http://localhost:3000/api/projects
        - http://localhost:3000/api/projects?status=STARTED
        - http://localhost:3000/api/projects?course=WebAPI
        - http://localhost:3000/api/projects?status=STARTED&course=WebAPI
    - These should return a 401 Unauthorized response
    - Inspect the response headers
        - WWW-Authenticate with value Basic realm='users' should be included

### Part 3 Authenticating a request

- First you'd need to generate a Base64-encoded string to use as credentials
    - Credentials format is username:password
    - Open https://onlinestringtools.com/convert-string-to-base64
    - Generate a string for admin:default
        - Result should look like this YWRtaW46ZGVmYXVsdA==
    - Change the password to something else and generate another string
        - Result would be different, you can also use YWRtaW46aW5jb3JyZWN0cHN3ZA==
- Open Insomnia REST client:
    - Open the request Headers tab
        - Add new header called Authorization
        - Set to basic YWRtaW46ZGVmYXVsdA==
    - Verify the requests already created
        - http://localhost:3000/api/projects
        - http://localhost:3000/api/projects?page=2
        - http://localhost:3000/api/projects?page=10
        - http://localhost:3000/api/projects?page=100
        - http://localhost:3000/api/projects?page=101
    - Server should return a 200 OK response, and a log message should show up in the terminal
    - Open the request Headers tab again
        - Modify the Authorization header value to basic YWRtaW46aW5jb3JyZWN0cHN3ZA== which is an incorrect password
    - Verify the requests already created
        - http://localhost:3000/api/projects
        - http://localhost:3000/api/projects?page=2
        - http://localhost:3000/api/projects?page=10
        - http://localhost:3000/api/projects?page=100
        - http://localhost:3000/api/projects?page=101
        - Server should return a 401 Unauthorized response
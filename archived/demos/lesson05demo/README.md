# Instructions

### Part 1 API Goals Canvas

Who | What | How | Input | Output | Status Codes
-|-|-|-|-|-
User | Manage Projects | Search for Projects | Nothing or Project Name | List of Matching Projects | TBD
-|-| Add new Projects | Project Info | New Project Info | TBD
-|-| Update Projects | Project Info | New Project Info | TBD
-|-| Delete Projects | Project ID | Nothing | TBD
Admin | Manage Courses | Search for Courses | Nothing or Course Name | List of Matching Courses | TBD
-|-| Add new Courses | Course Info | New Course Info | TBD 
-|-| Update Courses | Course Info | New Course Info | TBD
-|-| Delete Courses | Course ID | Nothing | TBD

### Part 2 Endpoint List

What | How | Endpoint | Parameters | Method | Description | Status Codes
-|-|-|-|-|-|-
Manage Projects |Search for projects | /projects | None for now | GET | Lists all projects in the DB | 200 on Success, 500 on Error
-|Create new project | /projects | Project info in request body as JSON | POST | Inserts the given project to the db | 200 on Success, 500 on Error
-| Update a project | /projects/:_id | _id: project id to be updated, project object in request body | PUT | Updates a given project | 200 on Success, 500 on Error  
-| Delete a Project | /projects/:_id | _id: project id to be deleted | DELETE | Deletes the project with the specified id value | 200 on Success, 500 on Error

### Part 3 Implementing POST /projects to add new projects to the database

- Call nodemon to run the project
- In routes/api/projects.js
    - Verify that project model is referenced
    - Add a POST handler for '/' (/api/projects)
        - Make sure the project implements bodyParser:
            - Call console.log(req.body); to see the body coming from the request
            - Call res.json(req.body); to send back the object that was sent originally
        - Open Insomnia REST Client and create a new request
            - Name it POST /projects
            - Use the projects endpoint http://localhost:3000/api/projects
            - Add a mock JSON object to the request body: {"test":"this is a test"}
            - Make sure request body is set to JSON
            - Click Send
            - Verify console logs and that the server returned the same object you sent
        - Back to the POST handler
            - Comment the lines we added above out
                - Console.log()
                - Res.json()
            - Call Project.Create() and use the parameters from the router.body object to fill in a new project object
            - Implement error handling logic
                - Return a response with status code 500 if there's an error
                - Return a response with status code 200 if creation was successful
        - Go back to Insomnia REST Client
            - Resend same request with mock object
            - An error message must be returned
            - What are we missing? Validation > Always validate user input
        - Back to the POST handler
            - Add if-else statements to verify that required fields are passed in the body object
                - Return status code 400 (bad request) if a required field is missing
        - Back to Insomnia REST Client
            - Resend same request with mock object
            - Verify error is handled correctly
            - Create a new request to POST /projects
            - Enter a valid project in JSON format in the request body
            - Send
            - Verify that server returned same object plus an id value

### Part 4 Implementing PUT /projects to update projects in the database

- In routes/api/projects.js
    - Add a PUT handler for '/:_id' (/api/projects/:_id)
        - Add if-else statements to verify that required fields are passed in the body object
            - Return status code 400 (bad request) if a required field is missing
        - Call Project.findOneAndUpdate() and:
            - use the parameters from the router.params objects to find the project in the database
            - use the parameters from the router.body to fill in the updated project object
        - Implement error handling logic
            - Return a response with status code 500 if there's an error
            - Return a response with status code 200 if update was successful
    - Go back to Insomnia REST Client
        - Create new request to PUT /projects/:_id
        - Send request with mock data to verify error message
        - Enter a valid project in JSON format in the request body
        - Send
        - Verify that server returned updated object 
			

### Part 5 Implementing DELETE /projects to delete projects from the database

- In routes/api/projects.js
    - Add a DELETE handler for '/:_id' (/api/projects/:_id)
    - Call Project.remove() and use the parameters from the router.params objects to find the project in the database
    - Implement error handling logic
        - Return a response with status code 500 if there's an error
        - Return a response with status code 200 if update was successful
    - Go back to Insomnia REST Client
        - Create new request to DELETE /projects/:_id
        - Send request with mock data to verify error message
        - Send request with valid ID and verify success message
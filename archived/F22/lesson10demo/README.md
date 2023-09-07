# Instructions

### Part 1  Query parameter-based versioning

- For simplicity, we'll apply this to only one endpoint but it can be applied globally in app.js
- In routes/api/projects.js
    - Create a new variable called version that receives the value of req.query.v
        - Set to 1 as default if no value is provided
    - Extract away all the code in router.get('/') to  a new method called GetProjectsV1
    - Create a new method called GetProjectsV2 that returns a message indicating it's work in progress
    - Add a switch statement to handle the different values for our versions
        - Case '1' calls GetProjectsV1
        - Case '2' calls GetProjectsV2
        - Default returns bad request error message
    - Open a terminal and run nodemon
    - Open Insomnia REST Client and verify the requests already created
        - http://localhost:3000/api/projects
        - Duplicate one of these requests, open the query tab and add a new parameter v with value 2
            - Verify that 'work in progress' message is returned
        - Modify parameter to value 3
            - Verify that bad request response is returned
    - Note: It's important to ensure that currently working endpoints continue to work when applying versioning to an already existing project

### Part 2 Path based versioning

- Create a new folder inside routers/api called v2
- Make a copy of projects.js inside of this new folder
- In routes/api/v2/projects.js
    - Add a comment at the very top of the document to indicate this is /api/v2/projects
    - Fix the mongoose model import, add another '../'
        - const Project = require('../../../models/project');
    - Modify GET handler for '/'
        - Remove switch statement
        - Bring code back from GetProjectsV1 function
        - Call res.setHeader() to send a custom header named version with value apiv2 back in the response object
- In app.js
    - Create a new router object pointing to the one we created inside v2 folder
    - Scroll down to app.use('/api/projects')
    - Add another app.use call and set endpoint to /api/v1/projects, use same router as above
    - Add another app.use call and set endpoint to /api/v2/projects, use new router object
- Open a terminal and run nodemon
- Open Insomnia REST Client and verify the requests already created
    - http://localhost:3000/api/projects
    - Duplicate one of these requests and modify endpoint to v1
        - Verify that request still works as expected
    - Duplicate another request and modify endpoint to v2
        - Verify that request returns expected result
        - Open the headers tab in the response panel
            - Verify that custom header version shows up with expected version number
- Note: It's important to ensure that currently working endpoints continue to work when applying versioning to an already existing project

# Instructions

### Part 1 Importing Mock Data

- Open MongoDB Compass
    - Connect to your database
    - Open the 'projects' collection
    - On the Documents tab, click on the green 'Add Data' button
    - Select Import File
    - Click Browse and search for MOCK_DATA.json (uploaded in /mockdata folder)
    - Select Input File Type as JSON
    - Click Import
- Open Insomnia REST Client
    - Send a GET request to /projects
    - Verify multiple results are returned

### Part 2 Implementing Filtering

- Call nodemon to run the project
- In routes/api/projects.js
    - Modify the GET handler for '/'
    - Assume filtering parameters will be passed in the URL
    - Create an empty object called query
    - Add if-else statement to check for req.query.course
        - If present then add it as a new attribute to query object
    - Add if-else statement to check for req.query.status
        - If present then add it as a new attribute to query object
    - Modify call to find()
        - Pass query object before the callback
- Open Insomnia REST client
    - Create new requests and verify:
        - http://localhost:3000/api/projects?status=STARTED
        - http://localhost:3000/api/projects?course=WebAPI
        - http://localhost:3000/api/projects?status=STARTED&course=WebAPI
        - http://localhost:3000/api/projects

### Part 3 Implement Pagination

- In routes/api/projects.js
    - At the top of the document, create constant to store pageSize and set it to 10
    - Modify the GET handler for '/'
    - Assume page parameters will be passed in the URL
    - Create a variable named page and set it to the value passed in req.query.page
        - Set default value as 1 in case nothing is provided
    - Create a variable named skipSize to calculate how many records to skip
    - Modify the call to find() and chain the following methods:
        - .sort() to sort by name A to Z
        - .limit() to limit number of records returned and pass pageSize as parameter
        - .skip() to skip n number of records and pass skipSize as parameter
- Open Insomnia REST client:
    - Create new requests and verify
        - http://localhost:3000/api/projects
        - http://localhost:3000/api/projects?page=2
        - http://localhost:3000/api/projects?page=10
        - http://localhost:3000/api/projects?page=100
        - http://localhost:3000/api/projects?page=101 must be empty
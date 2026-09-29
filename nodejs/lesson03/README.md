# Lesson 03: Create a Project Tracker API with Node.js and Express

This lesson builds a small project-tracker API with Express. The equivalent
FastAPI, Pydantic, and Uvicorn lesson is available in
[`python/lesson03/README.md`](../../python/lesson03/README.md).

## Prerequisites

- Node.js and npm installed.
- A basic understanding of JavaScript, HTTP requests, and JSON.
- Visual Studio Code or another code editor.
- Optional: [Postman](https://www.postman.com/downloads/) for testing requests.

## Part 1: Create a Project Tracker Application

- Open a terminal and install the following npm tools if they are not already installed:
    - Express Generator tool:
        - `npm i -g express-generator`
    - Nodemon:
        - `npm i -g nodemon`
- Use Express Generator to create a new app using scaffolding
    - Create or open the `nodejs/lesson03` folder in your editor.
    - If creating the project from scratch, run:
        - `npx express-generator --view=hbs`
            - `--view=hbs` selects Handlebars as the view engine.
            - The view engine is not required by the API endpoint, but the generated application includes a home page.
    - Install packages with `npm install`.
    - Start the application with `npm start` or `nodemon`.
    - Remove the unused `/routes/users.js` route and its registration from `app.js`:
        - `var usersRouter = require('./routes/users');`
        - `app.use('/users', usersRouter);`
    - Add Projects route
        - In Routes:
            - Create a new folder called API
            - In routes/api
                - Create projects.js
                - Import Express and create a router object.
                - Add a `GET /` handler that creates a mock project list.
                - Return the list with `res.status(200).json(projectList)`.
                - Export the router module.
        - In app.js:
            - Import the projects router.
            - Register it with `app.use('/api/projects', projectsRouter)`.
    - Start the application and navigate to [http://localhost:3000/api/projects/](http://localhost:3000/api/projects/).

## Part 2: Test the endpoint with Postman

1. Ensure the application is running with `npm start` or `nodemon`.
2. Open Postman and create a collection named **Web Frameworks and APIs**.
3. Create a `GET` request named **Project List**.
4. Request [http://localhost:3000/api/projects/](http://localhost:3000/api/projects/).
5. Send the request and verify that the status is `200` and the response body is a JSON array of projects.

You can also test the endpoint in a browser because it uses the `GET` method.


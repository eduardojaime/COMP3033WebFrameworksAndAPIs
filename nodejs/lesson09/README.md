# Instructions

### Part 1  Describing the tools

- Visit and review each tool:
    - OpenAPI map will help us as a reference for the structure of an OAS document https://openapi-map.apihandyman.io/
    - These two extensions enable Visual Studio Code to provide a viewer and autocomplete features:
        - https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer
        - https://marketplace.visualstudio.com/items?itemName=mermade.openapi-lint
    - This online editor can be used for practicing: https://editor.swagger.io/
    - We'll use these three NPM packages in our project:
        - SwaggerUI to offer a human-friendly rendering of our OAS document https://www.npmjs.com/package/swagger-ui-express
        - YAMLJS to be able to write our specification in YAML and use it with SwaggerUi https://www.npmjs.com/package/yamljs
        - Swagger-jsdoc to add comments to our endpoints which will be parsed into a OAS document automatically https://www.npmjs.com/package/swagger-jsdoc

### Part 2 Installing yamljs, swagger-jsdoc and swagger-ui-express

- Make sure to install these two VS Code extensions:
    - https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer
    - https://marketplace.visualstudio.com/items?itemName=mermade.openapi-lint
- Open a terminal and run the following commands:
    - npm i swagger-ui-express
    - npm i swagger-jsdoc
    - npm i yamljs
- To verify, open package.json and make sure these appear in the dependencies section
- In app.js
    - Create a new object called swaggerUi importing the swagger-ui-express package
    - Create a new object called YAML importing the yamljs package
    - Create a new object called swaggerJSDoc importing the swagger-jsdoc package
- Open a terminal and run nodemon to verify

### Part 3 Generating an OAS document manually

- Create a new folder called documentation in the root of the project
- Create a new file called api-specification.yaml inside this folder
- In /documentation/api-specification.yaml
    - Type in openapi and the autocomplete feature will fill in the rest
    - This is the basic specification document structure
    - Modify title, and version accordingly
    - Enter a new path called /projects
        - Provide a description
        - Add a new property called responses
            - Add status code 200
            - Provide a description for this response
    - Save your changes
    - When the SwaggerViewer extension is enabled, Visual Studio Code will display an icon with two bars and a magnifying glass in the top right corner of the editor
        - Click on this icon to open the preview tab
        - Verify everything looks as expected and modify your document accordingly
- In app.js
    - Scroll down and add a new line below 'var app = express()'
    - Create a new const object called swaggerDocument
    - Initialize it by calling YAM.load() and pass the path to the yaml file we just created
    - Call app.use with three parameters
        - Endpoint name will be '/api-docs'
        - Second parameter is swaggerUi.serve
        - Third parameter is swaggerUi.setup() and pass the swaggerDocument object as an argument
    - Save your changes
- Open a browser and navigate to http://localhost:3000/api-docs/

### Part 4 Generating an OAS document automatically using swagger-jsdoc

- Comment out code from example above
- In app.js
    - Create a new const object called options
        - This will represent our basic API definition document
        - Add a definition property
            - Provide same info as the basic OAS document
                - openapi
                - info
                    - title
                    - version
        - Add an 'apis' property
            - This property accepts a list of paths
            - For now, register everything in the routes/api folder: './routes/api/*.js'
    - Create a new object called swaggerSpec and call the swaggerJSDoc module with the options we just created
    - Call app.use in a similar way as above, only the third parameter will be different
        - Endpoint name will be '/api-docs'
        - Second parameter is swaggerUi.serve
        - Third parameter is swaggerUi.setup() and pass the swaggerSpec object as an argument
    - Save your changes
- Open a browser and navigate to http://localhost:3000/api-docs/
- In routes/api/projects.js
    - Add a comment block above the GET handler for '/' using /** .. */
    - Add the @openapi marker to the first line of the comment
    - Afterwards, describe the endpoint in the same way you did in the YAML file
        - /:
            - get:
                - description
                - response
                    - code
                        - Description
    - Save your changes
- Restart nodemon
- Open a browser and navigate to http://localhost:3000/api-docs/

### Part 5 Loading an OAS document as a link

- In app.js
    - Comment out code from example above
    - Create a const object called options
        - Add a property called swaggerOptions
        - Inside of this property add another one called url and set the value to the Petstore example URL 'http://petstore.swagger.io/v2/swagger.json'
    - Modify the last parameter of the app.use call to use the options object: swaggerUi.setup(null, options)
    - Save
- Open a browser and navigate to http://localhost:3000/api-docs/

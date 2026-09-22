# Lesson 02: Node.js HTTP, Connect, and Express

## Objective

In this lesson, you will install Node.js, create a basic HTTP server, and progressively improve it using Connect middleware and Express routing.

## Useful Commands

| Command | Description |
| --- | --- |
| `node -v` | Prints the installed Node.js version. |
| `npm -v` | Prints the installed npm version. |
| `node <file>` | Runs the specified JavaScript file. |
| `npm install <package>` | Installs an npm package locally. |

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/)
- A terminal, such as the VS Code integrated terminal

### Recommended VS Code extensions

- MongoDB for VS Code by MongoDB
- Code Spell Checker by Street Side Software
- Prettier - Code Formatter by Prettier
- HTML CSS Support by ecmel
- IntelliCode by Microsoft
- OpenAPI (Swagger) Editor by 42Crunch
- openapi-lint by Mermade
- Swagger Viewer by Arjun G
- YAML by Red Hat
- Todo Tree by Gruntfuggly

## Part 1: Install Node.js and npm

1. Open [nodejs.org](https://nodejs.org/).
2. Download the **LTS** version. The LTS release is recommended for classroom and production use.
3. Run the installer and complete the setup wizard.
4. Open a terminal and verify the installation:

   ```console
   node -v
   npm -v
   ```

   Both commands should display a version number.

5. Create a folder for this lesson and open it in Visual Studio Code.
6. Create `helloworld.js`:

   ```javascript
   console.log('hello world');
   ```

7. Run the file:

   ```console
   node helloworld.js
   ```

   The message should appear in the terminal.

## Part 2: Create a web application with the `http` module

1. Create `httpserver.js`.
2. Import Node.js's built-in `http` module.
3. Use `createServer()` to create a web server. The callback receives:
   - `request`: information sent by the client.
   - `response`: the object returned by the server.
4. Use `writeHead()` to set:
   - The status code to `200`.
   - The `Content-Type` header to `text/plain`.
5. Use `response.end()` to complete the response.
6. Use `listen()` to listen on port `3000`.
7. Log a message indicating that the server is running.
8. Start the server:

   ```console
   node httpserver.js
   ```

9. Open [http://localhost:3000](http://localhost:3000) and verify that the Hello World message appears.
10. Press **Ctrl+C** in the terminal to stop the server.

### Focus question

How could you make the application modular by creating separate functions for different endpoints? Consider extracting the path from `request.url` and using conditional logic. Is that approach maintainable and readable as the number of endpoints grows?

## Part 3: Use Connect middleware

1. Install Connect:

   ```console
   npm install connect
   ```

   Verify that `package.json` and the dependency information were created.

2. Create `connectserver.js`.
3. Import Connect, create an app with `connect()`, listen on port `3000`, and log a startup message.
4. Start the application:

   ```console
   node connectserver.js
   ```

   Visiting the root URL before adding middleware may display `Cannot GET /`.

### Add middleware

1. Create a `helloWorld` middleware function that accepts `request`, `response`, and `next`.
2. Set the response `Content-Type` to `text/plain` and return `hello world` with `response.end()`.
3. Register the middleware with `app.use()`.
4. Create a `logger` middleware function that logs `request.url` and `request.method`, then calls `next()`.
5. Register the logger before `helloWorld` so it runs first.
6. Create a `goodbyeWorld` middleware function that returns `goodbye world`.
7. Bind middleware to specific paths:

   ```javascript
   app.use('/hello', helloWorld);
   app.use('/goodbye', goodbyeWorld);
   ```

8. Restart the application and test:
   - [http://localhost:3000/hello](http://localhost:3000/hello)
   - [http://localhost:3000/goodbye](http://localhost:3000/goodbye)

## Part 4: Use Express routing

1. Install Express:

   ```console
   npm install express
   ```

   Verify the dependency in `package.json`.

2. Create `expressserver.js`.
3. Import Express, create an app with `express()`, listen on port `3000`, and log a startup message.
4. Start the application:

   ```console
   node expressserver.js
   ```

5. Use `app.get()` or `app.use()` to bind handlers to routes:
   - `/hello` should return a Hello World message.
   - `/goodbye` should return a Goodbye World message.
6. Test the routes:
   - [http://localhost:3000/hello](http://localhost:3000/hello)
   - [http://localhost:3000/goodbye](http://localhost:3000/goodbye)

## Summary

This lesson demonstrates the progression from Node.js's built-in HTTP module to Connect middleware and then Express routing. Compare how each approach handles requests, responses, middleware, and multiple endpoints.




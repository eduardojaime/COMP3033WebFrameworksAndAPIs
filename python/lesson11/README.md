# Python Lesson 11: CORS and Consuming an API

## Learning objectives

By the end of this lesson, you should be able to:

- Explain what the browser's same-origin policy and CORS are, and why a request can fail in a browser but succeed in Postman.
- Enable CORS in a FastAPI application with `CORSMiddleware` and a restricted list of allowed origins.
- Consume the API from a browser page (HTML and jQuery) and see a CORS preflight request in the browser's developer tools.
- Consume the API from a Python backend client (Streamlit) and explain why CORS does not apply to it.
- Keep credentials out of source code in both clients.

## Prerequisites

- Python 3.x, a PostgreSQL database configured as in the previous lessons, and the finished Lesson 10 API.
- [Postman](https://www.postman.com/downloads/) for testing requests.
- A modern browser with developer tools (F12).

## Why does CORS exist?

A browser only lets a page read responses from the **same origin** that served it. An origin is the combination of scheme, host, and port, so `http://localhost:5500` and `http://localhost:3000` are different origins. This is the browser's same-origin policy, and it protects users from malicious pages that call other sites with the user's credentials.

**Cross-Origin Resource Sharing (CORS)** is how a server tells the browser which other origins are allowed to read its responses. The server adds headers such as `Access-Control-Allow-Origin`. If the headers are missing, the browser blocks the page from reading the response.

Two things to remember:

- CORS is enforced by **browsers only**. Postman, `curl`, and server-side programs such as a Python script or a Streamlit app are not affected. It is not an authentication mechanism and does not protect your API from those clients; Basic authentication still does that job.
- A request that adds a header such as `Authorization` is not a "simple" request, so the browser first sends a **preflight** `OPTIONS` request asking whether the real request is allowed. The server must answer the preflight correctly before the browser sends the `GET`.

## Part 1: Set up the folders and run the server

### Organize the lesson folder

The lesson starts from the finished Lesson 10 API. The Lesson 10 code has already been copied into this folder; now give the lesson a structure with one folder for the API and one folder for each client.

1. Create these folders inside `python/lesson11`:

   ```text
   lesson11/
       server/
       client-html/
       client-streamlit/
   ```

2. Move all of the existing Lesson 10 files and folders (`server.py`, `config.py`, `security.py`, `requirements.txt`, `.env.example`, `.gitignore`, `alembic.ini`, `seed_projects.sql`, `alembic/`, `db/`, `routers/`, `schemas/`) into `server/`. Do not move `README.md`. Delete any `__pycache__` folders and any `.venv` you copied.
3. Open the `lesson11` folder in Visual Studio Code. All three folders should appear in the tree.

Each folder is a separate project with its own virtual environment and `requirements.txt`. Run commands from inside the folder you are working on.

### Set up the server

From `lesson11/server`, create the virtual environment, install the dependencies, and create your `.env` file:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` with your database URL and demo credentials. Never commit `.env` or real credentials.

Start the API and keep it running in this terminal:

```powershell
uvicorn server:app --reload --port 3000
```

Open a Postman request to `GET http://localhost:3000/api/v1/projects/` with your Basic Auth credentials to confirm that everything from Lesson 10 still works. You will add CORS later, but first you will see the problem it solves in Part 2.

## Part 2: Consume the API from a browser with HTML and jQuery

The page asks the user for a username and password instead of storing them in the file. Credentials that are written into a web page are visible to anyone who opens it, so never put Basic authentication credentials in browser-facing code.

1. In `client-html`, create `index.html`:

   ```html
   <!DOCTYPE html>
   <html lang="en">
       <head>
           <meta charset="UTF-8">
           <title>Projects</title>
           <!-- jQuery from the official CDN: https://code.jquery.com/ -->
           <script
               src="https://code.jquery.com/jquery-3.6.0.min.js"
               integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
               crossorigin="anonymous"></script>

           <script>
               // make this configurable for your environment
               var url = 'http://localhost:3000/api/v2/projects/?status=DONE';

               $(document).ready(function () {
                   $('#loadForm').on('submit', function (event) {
                       // keep the browser from reloading the page
                       event.preventDefault();

                       // Basic authentication is "username:password" encoded as Base64
                       var token = btoa($('#username').val() + ':' + $('#password').val());

                       $.ajax({
                           url: url,
                           method: 'GET',
                           headers: { Authorization: 'Basic ' + token },
                       })
                           .done(function (data, status, xhr) {
                               // the browser can read this header only because the server exposes it
                               $('#apiVersion').text(xhr.getResponseHeader('version'));
                               $('#message').text('');

                               var tableBody = $('#projectListing');
                               tableBody.empty();

                               data.forEach(function (elem) {
                                   // .text() escapes the values so data cannot inject HTML
                                   var row = $('<tr></tr>')
                                       .append($('<td></td>').text(elem.name))
                                       .append($('<td></td>').text(elem.status))
                                       .append($('<td></td>').text(new Date(elem.due_date + 'T00:00:00').toDateString()));
                                   tableBody.append(row);
                               });
                           })
                           .fail(function (xhr) {
                               // status 0 means the browser blocked or could not complete the request
                               $('#message').text(
                                   xhr.status === 0
                                       ? 'Request failed. Open the browser console (F12) to see if CORS blocked it.'
                                       : 'Request failed with status ' + xhr.status
                               );
                           });
                   });
               });
           </script>
       </head>
       <body>
           <h1>Projects</h1>

           <form id="loadForm">
               <input id="username" placeholder="Username" autocomplete="username" required>
               <input id="password" type="password" placeholder="Password" autocomplete="current-password" required>
               <button type="submit">Load projects</button>
           </form>

           <p>API version header: <strong id="apiVersion"></strong></p>
           <p id="message"></p>

           <table>
               <thead>
                   <tr>
                       <th>Project</th>
                       <th>Status</th>
                       <th>Due Date</th>
                   </tr>
               </thead>
               <tbody id="projectListing"></tbody>
           </table>
       </body>
   </html>
   ```

   Notice that the JSON field names are `snake_case` (`due_date`), as defined by the Pydantic schema.

2. Serve the page from a **different origin** than the API. From `lesson11/client-html`, in a new terminal:

   ```powershell
   py -m http.server 5500
   ```

   This server only hosts the static file. It does not need a virtual environment or any packages.

3. Open <http://localhost:5500/index.html> in your browser. The page origin is `http://localhost:5500` and the API origin is `http://localhost:3000`, so this is a cross-origin request.
4. Open the developer tools (F12) and select the **Network** and **Console** tabs. Enter your credentials and click **Load projects**.
5. The table stays empty because the API does not allow cross-origin requests yet. The console shows an error similar to `Access to XMLHttpRequest at 'http://localhost:3000/...' from origin 'http://localhost:5500' has been blocked by CORS policy`. The API received the request (check the Uvicorn log), but the browser refused to give the response to the page. The same request works in Postman.

   The finished `server` folder in the repository already includes the CORS code from Part 3. To reproduce the failure with it, comment out the `app.add_middleware(...)` call in `server.py` for now.

## Part 3: Enable CORS in the API

Now fix the failure by telling the browser which origins may call the API.

### Add CORS settings to the configuration

The allowed origins are configuration, not code, so they go in `.env`.

1. Add this to `.env.example` and to your `.env`:

   ```text
   # Comma-separated list of browser origins allowed to call the API.
   # An origin is scheme + host + port, with no path and no trailing slash.
   CORS_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
   ```

2. In `config.py`, add a setting that turns the comma-separated text into a list:

   ```python
   CORS_ORIGINS = [
       origin.strip()
       for origin in os.getenv("CORS_ORIGINS", "").split(",")
       if origin.strip()
   ]
   ```

   If `CORS_ORIGINS` is missing or empty, the list is empty and no browser origin is allowed.

### Register the CORS middleware

1. In `server.py`, import the middleware and the new setting:

   ```python
   from fastapi.middleware.cors import CORSMiddleware

   from config import CORS_ORIGINS
   ```

2. Register the middleware after the `app = FastAPI(...)` declaration and before the `include_router` calls:

   ```python
   # Allow browsers on these origins to call the API
   app.add_middleware(
       CORSMiddleware,
       allow_origins=CORS_ORIGINS,
       allow_methods=["GET"],
       allow_headers=["Authorization"],
       # lets browser code read the custom version header added in Lesson 10
       expose_headers=["version"],
   )
   ```

   - `allow_origins` is an explicit list. Avoid `["*"]` for an API that uses credentials: the wildcard allows every website to call your API.
   - `allow_methods` and `allow_headers` list only what the clients in this lesson need. Add `POST`, `PUT`, and `DELETE` only when a browser client needs them.
   - `expose_headers` is needed because browser code can read only a small set of response headers unless the server exposes others.

3. Save the file. Uvicorn reloads automatically. If you changed `.env`, restart Uvicorn, because settings are read at startup.
4. Test in Postman again. All requests should behave exactly as before, because CORS does not affect Postman.

### Test the browser client again

1. Reload <http://localhost:5500/index.html> and click **Load projects** again. The table fills with projects, and the API version header shows `apiv2`.
2. In the **Network** tab, find the two requests to `/api/v2/projects/`:
   - The `OPTIONS` request is the **preflight**. Look at its response headers, `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers`.
   - The `GET` request is the real request, and its response includes `Access-Control-Allow-Origin: http://localhost:5500`.
3. Experiments:
   - Open the page at <http://127.0.0.1:5500/index.html>. It works only because `http://127.0.0.1:5500` is in `CORS_ORIGINS`; `localhost` and `127.0.0.1` are different origins.
   - Remove `http://127.0.0.1:5500` from `.env`, restart Uvicorn, and try again. The request is blocked again.
   - Change the URL in the page to `/api/v1/projects/?status=DONE`. The `version` header is empty because v1 does not set it.

## Part 4: Consume the API from a Python backend with Streamlit

[Streamlit](https://streamlit.io/) turns a Python script into a web page. The important point for this lesson is **where the API call is made**: the Python code runs on the machine running Streamlit, not in the user's browser, so the browser never calls the API directly and CORS does not apply.

1. In `lesson11/client-streamlit`, create a virtual environment, activate it, and create `requirements.txt`:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

   ```text
   requests
   streamlit
   ```

2. Install the dependencies:

   ```powershell
   py -m pip install -r requirements.txt
   ```

3. Create `.gitignore` containing `.venv/` and `__pycache__/` so the virtual environment is not committed.
4. Create `streamlit_app.py`:

   ```python
   import os

   import requests
   import streamlit as st

   # the API location can be changed without editing the code
   API_URL = os.getenv("API_URL", "http://localhost:3000/api/v2/projects/")
   STATUSES = ["All", "TO DO", "IN PROGRESS", "DONE"]

   st.title("Projects")

   # credentials are typed by the user and kept in memory only
   st.sidebar.header("API credentials")
   username = st.sidebar.text_input("Username")
   password = st.sidebar.text_input("Password", type="password")

   status = st.selectbox("Status", STATUSES)
   page = st.number_input("Page", min_value=1, value=1, step=1)

   if st.button("Load projects"):
       params = {"page": page}
       if status != "All":
           params["status"] = status

       try:
           # requests builds the Basic Authorization header from the auth tuple
           response = requests.get(
               API_URL, params=params, auth=(username, password), timeout=10
           )
           response.raise_for_status()
       except requests.RequestException as error:
           st.error(f"Could not load projects: {error}")
       else:
           projects = response.json()
           st.caption(f"API version header: {response.headers.get('version', 'not set')}")

           if projects:
               st.dataframe(
                   [
                       {
                           "Project": project["name"],
                           "Status": project["status"],
                           "Due date": project["due_date"],
                       }
                       for project in projects
                   ],
                   hide_index=True,
               )
           else:
               st.info("No projects found.")
   ```

   - `requests.get(..., auth=(username, password))` sends the same `Authorization: Basic ...` header that the browser page sent, but from Python.
   - `raise_for_status()` turns `401`, `422`, and other error responses into exceptions that the app reports to the user.
   - `timeout` keeps the app from waiting forever if the API is down.

5. Make sure the API is still running, then start the app from `lesson11/client-streamlit`:

   ```powershell
   streamlit run streamlit_app.py
   ```

   Streamlit opens <http://localhost:8501> in your browser.
6. Enter your username and password in the sidebar, choose a status, and click **Load projects**. The table is populated and the version header shows `apiv2`.
7. Prove that CORS is not involved:
   - Remove the `CORS_ORIGINS` value from the server's `.env` (or comment the middleware out), restart Uvicorn, and click **Load projects** again. It still works, because the request is made by Python, not by the browser.
   - Add `http://localhost:8501` to `CORS_ORIGINS`. Nothing changes, because the origin of the Streamlit page is irrelevant to the API call.
8. Try a wrong password. The app shows the `401` error message instead of crashing.

## Choosing where to make the request

| | Browser client (HTML and jQuery) | Backend client (Streamlit) |
| --- | --- | --- |
| Where the call runs | In the user's browser | On the server running the Python code |
| CORS | Required; the server must allow the page's origin | Not applicable |
| Credentials | Must be typed by the user or issued per user; anything in the page is public | Can come from environment variables or a secrets store on the server |
| Typical use | Single-page apps and public websites | Dashboards, scheduled jobs, and server-to-server integrations |

## Review questions

1. What makes two URLs "cross-origin"? Are `http://localhost:3000` and `http://127.0.0.1:3000` the same origin?
2. The browser page failed but the same request succeeded in Postman. Why?
3. What is a preflight request, and why did the `Authorization` header trigger one?
4. Why is `allow_origins=["*"]` a poor choice for this API?
5. Why does the Streamlit app work even when `CORS_ORIGINS` is empty?
6. Why does the HTML page ask for a username and password instead of including them in the file?
7. Why was `expose_headers=["version"]` needed for the page to read the version header?

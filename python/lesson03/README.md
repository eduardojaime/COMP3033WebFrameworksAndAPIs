# Lesson 03: Create a Project Tracker API with FastAPI and Pydantic

In this lesson, you will create a small project-tracker API using Python,
FastAPI, Pydantic, and Uvicorn. The API initially returns an in-memory list of
projects. A later lesson can replace this mock data with a database.

## Learning objectives

By the end of the lesson, you should be able to:

- Create a Python virtual environment for an API project.
- Install FastAPI and Uvicorn with `pip`.
- Define a FastAPI application and a `GET` endpoint.
- Use a Pydantic model to describe and validate response data.
- Run an ASGI application with Uvicorn.
- Test an endpoint in a browser, Swagger UI, or Postman.

## Prerequisites

- Python 3.x installed. On Windows, the Python launcher is usually available as `py`.
- Visual Studio Code and the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
- A basic understanding of Python, HTTP requests, and JSON.
- Optional: [Postman](https://www.postman.com/downloads/) for testing requests.

## Part 1: Create the project

Create or open the `python/lesson03` folder in Visual Studio Code. Create this
initial project structure:

```text
lesson03/
├── .gitignore
├── README.md
├── requirements.txt
└── server.py
```

## Part 2: Create and activate a virtual environment

Run these commands from the `python/lesson03` folder.

### Windows PowerShell

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
```

### Windows Command Prompt

```cmd
py -m venv .venv
.venv\Scripts\activate.bat
```

### macOS or Linux

```bash
py -m venv .venv
source .venv/bin/activate
```

Confirm that the virtual environment's Python interpreter is being used:

```powershell
py -c "import sys; print(sys.executable)"
```

If PowerShell blocks activation, use the Command Prompt activation command or
follow your institution's approved PowerShell guidance. Do not change the
execution policy globally without permission.

## Part 3: Configure `.gitignore`

Create `.gitignore` with:

```gitignore
.venv/
__pycache__/
*.py[cod]
.env
```

Note: You can also copy over the contents of this file to yours: [Python.gitignore](https://github.com/github/gitignore/blob/main/Python.gitignore)

Do not commit the virtual environment or generated Python cache files.

## Part 4: Install FastAPI, Pydantic, and Uvicorn

Create `requirements.txt`:

```text
fastapi
pydantic
uvicorn[standard]
```

FastAPI uses Pydantic for data validation and serialization. Uvicorn runs the
FastAPI application as an ASGI web server. With the virtual environment
activated, install the dependencies:

```powershell
py -m pip install -r requirements.txt
```

Verify the installed packages:

```powershell
py -m pip show fastapi
py -m pip show pydantic
py -m pip show uvicorn
```

## Part 5: Define the project model and API

Create `server.py`:

```python
from fastapi import FastAPI
from pydantic import BaseModel


class Project(BaseModel):
    name: str
    due: str


app = FastAPI(title="Project Tracker API")


projects = [
    Project(name="API Documentation", due="2026-09-22"),
    Project(name="API Specification", due="2026-09-30"),
]


@app.get("/api/projects/", response_model=list[Project])
def list_projects() -> list[Project]:
    return projects
```

The `Project` class is a Pydantic model. Its annotations require every project
to contain a string `name` and a string `due` value. The `response_model`
argument tells FastAPI to validate and serialize the response as a list of
`Project` objects. FastAPI also uses the model to generate the OpenAPI schema.

## Part 6: Run the API

With the virtual environment activated, run:

```powershell
uvicorn server:app --reload --port 3000
```

The command loads the `app` object from `server.py`, starts Uvicorn, and
reloads the application when source files change.

Open these URLs:

- [http://localhost:3000/api/projects/](http://localhost:3000/api/projects/)
- [http://localhost:3000/docs](http://localhost:3000/docs)
- [http://localhost:3000/redoc](http://localhost:3000/redoc)

The projects endpoint returns JSON. The `/docs` page provides interactive
Swagger UI, and `/redoc` provides an alternative API documentation view.
Press **Ctrl+C** to stop the server.

## Part 7: Test the endpoint with Postman

1. Ensure the FastAPI application is running.
2. Open Postman and create a collection named **Web Frameworks and APIs**.
3. Create a `GET` request named **Project List**.
4. Send it to [http://localhost:3000/api/projects/](http://localhost:3000/api/projects/).
5. Verify that the response status is `200`.
6. Verify that the response body contains a JSON array with `name` and `due` properties.

You can also run the request from Swagger UI by selecting **Try it out** and
then selecting **Execute**.

## Part 8: Check Pydantic validation

Change one mock project temporarily so that `name` is an integer instead of a
string. Restart or save the application and observe the validation error. The
model is the contract for the API response, so invalid project data should not
be returned as a valid `Project` response.

Restore the correct string value before completing the lesson.

## Expected requests

| Request | Expected result |
| --- | --- |
| `GET /api/projects/` | `200 OK` and a JSON array of projects |
| `GET /docs` | Interactive Swagger UI |
| `GET /redoc` | Alternative generated API documentation |
| `GET /unknown` | `404 Not Found` |

## Completion checklist

- [ ] The virtual environment is created and activated.
- [ ] Dependencies are listed in `requirements.txt` and installed.
- [ ] The `Project` Pydantic model is defined.
- [ ] `GET /api/projects/` returns the mock project list.
- [ ] The endpoint is documented in `/docs` and `/redoc`.
- [ ] The endpoint was tested with a browser, Swagger UI, or Postman.
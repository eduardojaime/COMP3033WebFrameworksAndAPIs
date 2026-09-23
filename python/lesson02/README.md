# Lesson 02: Python and FastAPI

## Objective

In this lesson, you will set up a Python web application, create an isolated virtual environment, install dependencies with `pip`, and build a simple API using FastAPI.

By the end of the lesson, you should be able to:

- Verify a Python installation.
- Create and activate a virtual environment.
- Install project dependencies from `requirements.txt`.
- Create a basic FastAPI application.
- Define simple routes and return JSON responses.
- Run and test an API with Uvicorn.
- Use FastAPI's automatically generated documentation.

## Prerequisites

- A computer with an internet connection.
- [Visual Studio Code](https://code.visualstudio.com/).
- Latest [Python 3.x](https://www.python.org/downloads/) via the Python Install Manager.
- The [**Python** extension for Visual Studio Code by Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
- A basic understanding of HTTP requests and JSON.

## Part 1: Verify Python and pip

Open a terminal in Visual Studio Code and run:

```powershell
py --version
py -m pip --version
```

Both commands should display a version number. If `py` is not recognized on Windows, verify that Python is installed correctly and that the Python launcher is available.

```powershell
py --version
py -m pip --version
```

Use the Python interpreter selected by the **Python: Select Interpreter** command in Visual Studio Code.

## Part 2: Create the project

1. Create a folder named `lesson02` inside the Python course folder.
2. Open the folder in Visual Studio Code.
3. Create the following files:

```text
lesson02/
├── .gitignore
├── README.md
├── requirements.txt
└── server.py
```

## Part 3: Create and activate a virtual environment

A virtual environment keeps this lesson's Python packages separate from other projects.

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

After activation, the terminal usually displays `(.venv)` before the prompt. Confirm that the environment is active:

```powershell
py -c "import sys; print(sys.executable)"
```

To leave the virtual environment, run:

```powershell
deactivate
```

If PowerShell prevents activation because of its execution policy, do not change the policy globally without permission. Use the Command Prompt activation command instead or follow your institution's approved PowerShell guidance.

## Part 4: Configure `.gitignore`

Create a `.gitignore` file with the following entries:

```gitignore
.venv/
__pycache__/
*.py[cod]
.env
```

Note: You can also copy over the contents of this file to yours: [Python.gitignore](https://github.com/github/gitignore/blob/main/Python.gitignore)

The virtual environment and Python cache files should not be committed to Git. Only the project files and dependency definition should be submitted.

## Part 5: Create `requirements.txt`

Create `requirements.txt` with these direct dependencies:

```text
fastapi
uvicorn[standard]
```

FastAPI provides the web framework. Uvicorn is the ASGI server used to run the FastAPI application.

With the virtual environment activated, install the dependencies:

```powershell
py -m pip install -r requirements.txt
```

You can verify the installation with:

```powershell
py -m pip show fastapi
py -m pip show uvicorn
```

## Part 6: Create a simple FastAPI server

Create `server.py` with the following application:

```python
from fastapi import FastAPI

app = FastAPI(title="Lesson 02 API")


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}


@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Hello, {name}!"}
```

The `app` variable is the FastAPI application. The `@app.get()` decorators connect URLs to Python functions.

## Part 7: Run the server

Make sure the virtual environment is activated, then run:

```powershell
uvicorn server:app --reload --port 3000
```

The command means:

- `server` refers to `server.py`.
- `app` refers to the FastAPI application object.
- `--reload` restarts the server when source files change.
- `--port 3000` uses the same port as the Node.js lesson.

### Why use Uvicorn instead of `py server.py`?

Running `py server.py` executes the Python file once and then exits unless the file contains additional code that starts a web server. Creating a FastAPI object does not, by itself, open a network port or listen for HTTP requests.

Uvicorn is an **ASGI server** (Asynchronous Server Gateway Interface). It provides the runtime that:

- Opens a port and listens for HTTP connections.
- Receives HTTP requests and passes them to the FastAPI application.
- Sends FastAPI responses back to the client.
- Supports asynchronous request handling through the ASGI standard.
- Provides development features such as `--reload` and useful server logging.

Therefore, `uvicorn server:app` means: load the `app` object from `server.py` and serve it over HTTP. You could start Uvicorn from Python code, but the command-line approach keeps application code and server configuration separate:

```python
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="127.0.0.1", port=3000, reload=True)
```

For this lesson, use the Uvicorn command because it makes the FastAPI-to-ASGI relationship explicit and matches how the application is commonly run during development and deployment.

Open these URLs in a browser:

- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/hello/Student](http://localhost:3000/hello/Student)
- [http://localhost:3000/docs](http://localhost:3000/docs)
- [http://localhost:3000/redoc](http://localhost:3000/redoc)

The `/docs` page provides an interactive Swagger UI. The `/redoc` page provides an alternative API documentation interface.

Press **Ctrl+C** in the terminal to stop the server.

## Part 8: Add a query-parameter route

Add a route that accepts two numbers as query parameters:

```python
@app.get("/calculate")
def calculate(x: float, y: float):
    return {
        "x": x,
        "y": y,
        "sum": x + y,
    }
```

Test it in a browser:

```text
http://localhost:3000/calculate?x=16&y=4
```

FastAPI validates the query parameters and automatically returns an error when required values are missing or are not valid numbers.

## Part 9: Test the API

Test the following requests and record the results:

| Request | Expected result |
| --- | --- |
| `GET /` | A welcome JSON response |
| `GET /hello/Student` | A personalized greeting |
| `GET /calculate?x=16&y=4` | A JSON response containing the sum |
| `GET /calculate?x=abc&y=4` | A validation error |
| `GET /calculate?x=16` | A missing-parameter error |
| `GET /unknown` | A not-found response |

## Troubleshooting

### The package cannot be imported

Make sure the virtual environment is active and install the dependencies again:

```powershell
py -m pip install -r requirements.txt
```

### Uvicorn cannot find `server:app`

Run the command from the folder containing `server.py`. Confirm that the file is named `server.py` and that the application variable is named `app`.

### The port is already in use

Stop the other application using port `3000`, or use another port:

```powershell
uvicorn server:app --reload --port 3001
```

### Visual Studio Code uses the wrong Python interpreter

Open the Command Palette, select **Python: Select Interpreter**, and choose the interpreter inside `.venv`.

## Security requirements

- Do not commit API keys, passwords, tokens, or connection strings.
- Do not commit the `.venv` directory.
- Do not disable security software or expose the development server to the public internet.
- Use environment variables for secrets in future applications.

## Checklist

Before considering this lesson complete, confirm each item:

- [ ] Python and pip are installed and their versions have been verified.
- [ ] A `.venv` virtual environment was created and activated.
- [ ] The correct Python interpreter was selected in Visual Studio Code.
- [ ] `requirements.txt` contains FastAPI and Uvicorn.
- [ ] The dependencies were installed with `py -m pip install -r requirements.txt`.
- [ ] `server.py` contains a working FastAPI application.
- [ ] The root route returns a JSON response.
- [ ] The path-parameter route returns a personalized response.
- [ ] The query-parameter route was tested with valid values.
- [ ] Missing and invalid query parameters were tested.
- [ ] The application was started with Uvicorn.
- [ ] The `/docs` and `/redoc` pages were opened successfully.
- [ ] `.gitignore` excludes `.venv/` and Python cache files.
- [ ] No credentials, tokens, or connection strings were committed.
- [ ] A README, source files, and dependency file are ready for the Git repository.

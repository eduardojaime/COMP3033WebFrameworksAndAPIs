# Import fastapi library
from fastapi import FastAPI
# Create an app object using FastAPI, provide a title for the API
app = FastAPI(title="Example API with FastAPI and Uvicorn", description="This is an example API built using FastAPI and Uvicorn.", version="1.0.0")
# Configure app with handlers for different routes, and define the logic for each route
@app.get("/") # root
def hello_world():
    return { "message": "Bonjour le monde!" }

@app.get("/hello/{name}") # dynamic route
def hello_name(name: str):
    # string interpolation > use f-string and curly brackets to insert the value 
    return { "message": f"Bonjour {name}!" }

@app.get("/calculate") # passing query parameters
def calculate(x: int, y: int): # param validation is done by FastAPI based on the type declarations
    # examples: 
    # http://127.0.0.1:3000/calculate?x=10&y=xyz > validation error
    # http://127.0.0.1:3000/calculate?x=10&y=5 > correct response
    return { "result": f"The sum of {x} and {y} is {x + y}"}

# No need to configure ports or listening, uvicorn will handle that
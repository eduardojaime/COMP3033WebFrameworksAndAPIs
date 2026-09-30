# for creating the WebAPI application
from fastapi import FastAPI
# for model definitions
from pydantic import BaseModel

# MODEL
# Define the data model for the request body
# Model classes will be used to validate the request body and generate OpenAPI documentation (schemas)
class Project(BaseModel):
    _id: int
    name: str
    due_date: str
    status: str

# Mock some data - in a real application, this would be stored in a database
projects_list = [
    Project(_id=1, name="LAB01 GitHub Setup", due_date="2026-09-28", status="Completed"),
    Project(_id=2, name="LAB02 Contact Manager API", due_date="2026-10-05", status="In Progress"),
    Project(_id=3, name="Assignment 01", due_date="2026-10-12", status="Not Started")
]

# Declare the app object
# Add metadata to the FastAPI app, including title, description, and version to document with OpenAPI/Swagger
# Swagger UI will be available at http://localhost:3000/docs and ReDoc at http://localhost:3000/redoc
app = FastAPI(title="Project Management API", description="Demo API for managing projects", version="1.0.0")

# CONTROLLER
# Create a GET endpoint to retrieve all items
# Route is defined using the @app.get decorator, which specifies the HTTP method (GET) and the path (/api/projects)
@app.get("/api/projects", response_model=list[Project], description="Retrieve all projects", summary="Get all projects")
# Functionality is defined as a Python function that returns the list of projects
def list_projects() -> list[Project]:
    # here you would put your business logic, like database access, processing, filters, pagination, sorting, etc.
    # for now just return the list we have
    # VIEW fastapi will handle the serialization of the list of Project objects to JSON and return it as the response body
    return projects_list

# Import libraries
# WebAPI related
from fastapi import FastAPI, Depends
# Database related
from sqlalchemy.orm import Session # to manage db connections and sessions
# db modules
from db.connection import get_db # to be able to pass a db connection to the route functions
from db.models import Project
# Pydantic schemas 
from schemas import ProjectRead

# Declare the app object
app = FastAPI(title="Project Tracker API", version="1.0.0", description="A simple API for managing school projects.")

# Define route handlers (endpoints) for the API
# GET endpoint to retrieve all projects from the database
# GET /api/projects
@app.get("/api/projects", response_model=list[ProjectRead], description="Retrieves all projects from the database.")
# Dependency injection to get a database session for the request
# The db parameter is automatically provided by FastAPI using the get_db function defined in db/connection.py
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all() 

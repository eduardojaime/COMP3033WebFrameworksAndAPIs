# for creating the WebAPI application
from fastapi import Depends, FastAPI
# for a typed database session parameter
from sqlalchemy.orm import Session

# db module: connection.py (engine/session) and models.py (mapped classes)
from db.connection import get_db
from db.models import Project
# response validation schema
from schemas import ProjectRead

# Declare the app object
# Swagger UI will be available at http://localhost:3000/docs and ReDoc at http://localhost:3000/redoc
app = FastAPI(
    title="Project Management API",
    description="Demo API for managing projects, backed by PostgreSQL",
    version="2.0.0",
)


# CONTROLLER
# Create a GET endpoint to retrieve all projects from the database.
# Lesson 04 is intentionally read-only; create, update, and delete operations
# are introduced in a later lesson.
@app.get("/api/projects/", response_model=list[ProjectRead], description="Retrieve all projects", summary="Get all projects")
def list_projects(db: Session = Depends(get_db)) -> list[Project]:
    return db.query(Project).all()

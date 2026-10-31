# for creating the WebAPI application and handling CRUD responses
from fastapi import Depends, FastAPI, HTTPException, Response, status
# for a typed database session parameter
from sqlalchemy.orm import Session

# db module: connection.py (engine/session) and models.py (mapped classes)
from db.connection import get_db
from db.models import Project
# request and response validation schemas
from schemas import ProjectCreate, ProjectRead, ProjectUpdate

# Declare the app object
# Swagger UI will be available at http://localhost:3000/docs and ReDoc at http://localhost:3000/redoc
app = FastAPI(
    title="Project Management API",
    description="Demo API for managing projects, backed by PostgreSQL",
    version="2.0.0",
)


# CONTROLLER
@app.get(
    "/api/projects/",
    response_model=list[ProjectRead],
    summary="Get all projects",
)
def list_projects(db: Session = Depends(get_db)) -> list[Project]:
    return db.query(Project).all()


@app.post(
    "/api/projects/",
    response_model=ProjectRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a project",
)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
) -> Project:
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.put(
    "/api/projects/{project_id}",
    response_model=ProjectRead,
    summary="Replace a project",
)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
) -> Project:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    project.name = payload.name
    project.due_date = payload.due_date
    project.status = payload.status

    db.commit()
    db.refresh(project)
    return project


@app.delete(
    "/api/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a project",
)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> Response:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

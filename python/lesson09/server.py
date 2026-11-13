from secrets import compare_digest
from typing import Annotated

# for creating the WebAPI application and handling CRUD responses
from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
# for HTTP Basic authentication
from fastapi.security import HTTPBasic, HTTPBasicCredentials
# for a typed database session parameter
from sqlalchemy.orm import Session

# authentication settings loaded from the local .env file
from config import BASIC_AUTH_PASSWORD, BASIC_AUTH_USERNAME
# db module: connection.py (engine/session) and models.py (mapped classes)
from db.connection import get_db
from db.models import Project
# request and response validation schemas
from schemas import ProjectCreate, ProjectRead, ProjectStatus, ProjectUpdate

basic_auth = HTTPBasic()


def require_basic_auth(
    credentials: Annotated[HTTPBasicCredentials, Depends(basic_auth)],
) -> str:
    # compare_digest avoids leaking information through comparison timing
    username_matches = compare_digest(
        credentials.username, BASIC_AUTH_USERNAME
    )
    password_matches = compare_digest(
        credentials.password, BASIC_AUTH_PASSWORD
    )

    if not (username_matches and password_matches):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username


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
    summary="Get projects with optional filters and pagination",
    dependencies=[Depends(require_basic_auth)],
)
def list_projects(
    course: str | None = None,
    status: ProjectStatus | None = None,
    page: int = Query(default=1, ge=1),
    db: Session = Depends(get_db),
) -> list[Project]:
    page_size = 10
    query = db.query(Project)

    if course is not None:
        query = query.filter(Project.course == course)
    if status is not None:
        query = query.filter(Project.status == status)

    # ID is a tie-breaker so pages are stable when names match
    return (
        query.order_by(Project.name.asc(), Project.id.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )


@app.post(
    "/api/projects/",
    response_model=ProjectRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a project",
    dependencies=[Depends(require_basic_auth)],
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
    dependencies=[Depends(require_basic_auth)],
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
    project.course = payload.course
    project.status = payload.status

    db.commit()
    db.refresh(project)
    return project


@app.delete(
    "/api/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a project",
    dependencies=[Depends(require_basic_auth)],
)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> Response:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

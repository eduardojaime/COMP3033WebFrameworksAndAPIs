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

# the description appears in Swagger UI's Authorize dialog
basic_auth = HTTPBasic(description="Use the demo username and password from your .env file")


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


# Reusable documentation for responses that several endpoints can return
unauthorized_response = {
    401: {"description": "Missing or invalid Basic credentials"}
}
not_found_response = {404: {"description": "Project not found"}}

# Tag descriptions group the endpoints and are shown in Swagger UI and ReDoc
tags_metadata = [
    {"name": "Projects", "description": "Create, read, update, and delete projects."},
]

# Declare the app object
# Swagger UI is served at /docs, ReDoc at /redoc, and the raw OpenAPI document at /openapi.json
app = FastAPI(
    title="Project Management API",
    summary="Demo API for managing course projects",
    description=(
        "Demo API for managing projects, backed by PostgreSQL.\n\n"
        "Descriptions support **Markdown**. "
        "All endpoints require HTTP Basic authentication."
    ),
    version="3.0.0",
    contact={"name": "COMP3033 Web Frameworks and APIs"},
    openapi_tags=tags_metadata,
)


# CONTROLLER
@app.get(
    "/api/projects/",
    response_model=list[ProjectRead],
    summary="Get projects with optional filters and pagination",
    tags=["Projects"],
    responses=unauthorized_response,
    dependencies=[Depends(require_basic_auth)],
)
def list_projects(
    course: str | None = Query(default=None, description="Only return projects for this course"),
    status: ProjectStatus | None = Query(default=None, description="Only return projects with this status"),
    page: int = Query(default=1, ge=1, description="Page number, 10 projects per page"),
    db: Session = Depends(get_db),
) -> list[Project]:
    """Return one page of projects ordered by name.

    Combine `course` and `status` to filter the results.
    """
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
    tags=["Projects"],
    responses=unauthorized_response,
    dependencies=[Depends(require_basic_auth)],
)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
) -> Project:
    """Create a project. `status` defaults to `TO DO` when omitted."""
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.put(
    "/api/projects/{project_id}",
    response_model=ProjectRead,
    summary="Replace a project",
    tags=["Projects"],
    responses={**unauthorized_response, **not_found_response},
    dependencies=[Depends(require_basic_auth)],
)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
) -> Project:
    """Replace every editable field of an existing project."""
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
    tags=["Projects"],
    responses={**unauthorized_response, **not_found_response},
    dependencies=[Depends(require_basic_auth)],
)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> Response:
    """Delete a project by ID. A successful delete returns no body."""
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

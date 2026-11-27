# Handles /api/v1/projects (and the legacy /api/projects alias)
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from db.connection import get_db
from db.models import Project
from schemas import ProjectCreate, ProjectRead, ProjectStatus, ProjectUpdate
from security import require_basic_auth

# every route in this router requires Basic authentication
router = APIRouter(
    tags=["Projects v1"],
    dependencies=[Depends(require_basic_auth)],
    responses={401: {"description": "Missing or invalid Basic credentials"}},
)


def get_projects_v1(
    db: Session, course: str | None, status: ProjectStatus | None, page: int
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


def get_projects_v2() -> list[Project]:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Version 2 of this endpoint is a work in progress",
    )


@router.get(
    "/",
    response_model=list[ProjectRead],
    summary="Get projects with optional filters and pagination",
)
def list_projects(
    course: str | None = Query(default=None, description="Only return projects for this course"),
    status: ProjectStatus | None = Query(default=None, description="Only return projects with this status"),
    page: int = Query(default=1, ge=1, description="Page number, 10 projects per page"),
    v: Literal["1", "2"] = Query(default="1", description="API version (query-parameter versioning)"),
    db: Session = Depends(get_db),
) -> list[Project]:
    """Return one page of projects ordered by name.

    Combine `course` and `status` to filter the results.
    """
    match v:
        case "1":
            return get_projects_v1(db, course, status, page)
        case "2":
            return get_projects_v2()


@router.post(
    "/",
    response_model=ProjectRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a project",
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


@router.put(
    "/{project_id}",
    response_model=ProjectRead,
    summary="Replace a project",
    responses={404: {"description": "Project not found"}},
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


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a project",
    responses={404: {"description": "Project not found"}},
)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> Response:
    """Delete a project by ID. A successful delete returns no body."""
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

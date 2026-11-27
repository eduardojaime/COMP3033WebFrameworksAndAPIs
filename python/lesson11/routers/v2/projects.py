# Handles /api/v2/projects
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from db.connection import get_db
from db.models import Project
from routers.v1.projects import get_projects_v1
from schemas import ProjectRead, ProjectStatus
from security import require_basic_auth

router = APIRouter(
    tags=["Projects v2"],
    dependencies=[Depends(require_basic_auth)],
    responses={401: {"description": "Missing or invalid Basic credentials"}},
)


@router.get(
    "/",
    response_model=list[ProjectRead],
    summary="Get projects with optional filters and pagination (v2)",
)
def list_projects(
    response: Response,
    course: str | None = Query(default=None, description="Only return projects for this course"),
    status: ProjectStatus | None = Query(default=None, description="Only return projects with this status"),
    page: int = Query(default=1, ge=1, description="Page number, 10 projects per page"),
    db: Session = Depends(get_db),
) -> list[Project]:
    """Same results as v1 for now; the custom `version` response header identifies v2."""
    response.headers["version"] = "apiv2"
    return get_projects_v1(db, course, status, page)
